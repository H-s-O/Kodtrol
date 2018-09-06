import { getCompiledScriptPath } from './lib/fileSystem';
import ScriptRenderer from './ScriptRenderer';
import TimelineRenderer from './TimelineRenderer';
import Ticker from './lib/Ticker';
import MidiInput from './inputs/MidiInput';
import OscInput from './inputs/OscInput';
import DmxOutput from './outputs/DmxOutput';
import AudioOutput from './outputs/AudioOutput';

export default class Renderer {
  outputs = {};
  inputs = {};
  currentRenderer = null;
  ticker = null;
  state = null;
  dmxBaseData = null;
  currentRendererIsTimeline = false;
  
  constructor() {
    const dmxOutput = new DmxOutput();
    this.outputs.dmx = dmxOutput;
    
    const audioOutput = new AudioOutput();
    this.outputs.audio = audioOutput;
    
    const midiInput = new MidiInput(this.onMidiInput);
    this.inputs.midi = midiInput;
    
    const oscInput = new OscInput(this.onOscInput);
    this.inputs.osc = oscInput;
    
    process.on('exit', this.onExit);
    process.on('message', this.onMessage);
  }
  
  onExit = () => {
    this.destroyRendererRelated();
    this.destroy();
  }
  
  destroy = () => {
    Object.values(this.inputs).forEach((input) => input.destroy());
    Object.values(this.outputs).forEach((output) => output.destroy());
    
    this.inputs = null;
    this.outputs = null;
    this.state = null;
    this.dmxBaseData = null;
  }
  
  destroyRendererRelated = () => {
    if (this.ticker) {
      this.ticker.destroy();
      this.ticker = null;
    }
    if (this.currentRenderer) {
      this.currentRenderer.destroy();
      this.currentRenderer = null;
    }
    this.currentRendererIsTimeline = false;
  }
  
  onMessage = (message) => {
    if ('updateRenderer' in message) {
      this.state = message.updateRenderer;
      this.updateRenderer();
    } else if ('updateTimelineInfo' in message) {
      this.updateTimelineInfo(message.updateTimelineInfo);
      this.send({
        'updateTimelineInfo': true,
      });
    }
  }
  
  updateRenderer = () => {
    this.destroyRendererRelated();
    
    const { previewScript, runTimeline, scripts, devices, timelines } = this.state;
    console.log('Renderer.updateRenderer()', previewScript, runTimeline);
    
    this.dmxBaseData = this.computeBaseDmxData(devices);
    
    if (previewScript) {
      const script = scripts.find(({id}) => id === previewScript);
      const { previewTempo } = script;
      
      // temp
      delete require.cache[getCompiledScriptPath(previewScript)];
      
      this.currentRenderer = new ScriptRenderer(script, devices);
      this.ticker = new Ticker(this.tickerFrame, this.tickerBeat, previewTempo || 120);
      
      return;
    }
    
    if (runTimeline) {
      this.currentRendererIsTimeline = true;
      
      const timeline = timelines.find(({id}) => id === runTimeline);
      const { tempo } = timeline;
      
      this.currentRenderer = new TimelineRenderer(timeline, scripts, devices);
      this.ticker = new Ticker(this.tickerFrame, this.tickerBeat, tempo);
      
      return;
    }
    
    this.updateDmx();
    this.updateAudio();
  }
  
  updateTimelineInfo = (data) => {
    console.log('Renderer.updateTimelineInfo', data);
    
    if (this.currentRenderer && this.currentRendererIsTimeline) {
      if ('position' in data) {
        this.currentRenderer.setPosition(data.position);
      }
    }
  }
  
  send = (data) => {
    process.send(data);
  }
  
  tickerFrame = (delta) => {
    const renderData = this.currentRenderer.render(delta);

    this.updateDmx(renderData.dmx);
    this.updateAudio(renderData.audio);
    
    if (this.currentRendererIsTimeline) {
      this.send({
        timelineInfo: {
          position: this.currentRenderer.currentTime,
        },
      });
    }
  }
  
  tickerBeat = (beat, delta) => {
    if (this.currentRenderer) {
      this.currentRenderer.beat(beat, delta);
    }
  }
  
  onMidiInput = (data) => {
    if (this.currentRenderer) {
      this.currentRenderer.input('midi', data);
    }
  }
  
  onOscInput = (data) => {
    if (this.currentRenderer) {
      this.currentRenderer.input('osc', data);
    }
  }
  
  updateDmx = (data = null) => {
    const allData = {
      ...this.dmxBaseData,
      ...data,
    };

    const dmx = this.outputs.dmx;
    dmx.send(allData);
  }
  
  updateAudio = (data = null) => {
    const audio = this.outputs.audio;
    audio.send(data);
  }
  
  computeBaseDmxData = (allDevices) => {
    return allDevices.reduce((obj, {channels, startChannel}) => ({
      ...obj,
      ...channels.reduce((obj2, {defaultValue}, index) => {
        return {
          ...obj2,
          [Number(startChannel) + index]: defaultValue,
        };
      }, {}),
    }), {});
  }
}
