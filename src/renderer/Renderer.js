import { getCompiledScriptPath } from './lib/fileSystem';
import ScriptRenderer from './ScriptRenderer';
import TimelineRenderer from './TimelineRenderer';
import Ticker from './lib/Ticker';
import MidiInput from './inputs/MidiInput';
import OscInput from './inputs/OscInput';
import DmxOutput from './outputs/DmxOutput';
import ArtnetOutput from './outputs/ArtnetOutput';
import AudioOutput from './outputs/AudioOutput';
import Store from './data/Store';
import * as StoreEvent from './events/StoreEvent';

export default class Renderer {
  store = null;
  outputs = {};
  inputs = {};
  currentRenderer = null;
  ticker = null;
  state = null;
  dmxBaseData = null;
  currentRendererIsTimeline = false;
  playing = false;
  
  constructor() {
    this.store = new Store();
    this.store.on(StoreEvent.DEVICE_CHANGED, this.onDeviceChanged);
    
    const dmxOutput = new DmxOutput();
    this.outputs.dmx = dmxOutput;
    
    const artnetOutput = new ArtnetOutput();
    this.outputs.artnet = artnetOutput;
    
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
  
  onDeviceChanged = (data) => {
    console.log(data.item.id, data.status);
  }
  
  onMessage = (message) => {
    if ('updateRenderer' in message) {
      const { updateRenderer } = message;
      this.updateRenderer(updateRenderer);
    } else if ('timelineInfo' in message) {
      const { timelineInfo } = message;
      this.updateTimelineInfo(message.timelineInfo);
      this.send({
        'timelineInfo': message.timelineInfo,
      });
    }
  }
  
  updateRenderer = (data) => {
    this.store.update(data);
    
    this.state = data;

    const { previewScript, runTimeline, scripts, devices, timelines } = this.state;
    console.log('Renderer.updateRenderer()', previewScript, runTimeline);
    
    this.dmxBaseData = this.computeBaseDmxData(devices);
    
    if (previewScript) {
      const script = scripts.find(({id}) => id === previewScript);
      // Guard in case script was deleted
      if (!script) {
        return;
      }
      
      const { previewTempo, id, lastUpdated } = script;
      
      // Skip reset if same script and not updated
      if (this.currentRenderer) {
        if (this.currentRenderer.scriptId === id
            && this.currentRenderer.scriptLastUpdated === lastUpdated) {
          return;
        }
      }
      
      this.destroyRendererRelated();
      
      // temp
      delete require.cache[getCompiledScriptPath(previewScript)];
      
      this.currentRenderer = new ScriptRenderer(script, devices);
      this.ticker = new Ticker(this.tickerFrame, this.tickerBeat, previewTempo || 120);
      this.ticker.start();
      
      return;
    }
    
    if (runTimeline) {
      this.currentRendererIsTimeline = true;
      
      const timeline = timelines.find(({id}) => id === runTimeline);
      // Guard in case timeline was deleted
      if (!timeline) {
        return;
      }
      
      this.destroyRendererRelated();
      
      const { tempo } = timeline;
      
      this.currentRenderer = new TimelineRenderer(timeline, scripts, devices);
      this.ticker = new Ticker(this.tickerFrame, this.tickerBeat, tempo);
      
      this.updateTimelinePlaybackStatus();
      
      return;
    }
    
    this.updateDmx();
    this.updateAudio();
  }
  
  updateTimelineInfo = (data) => {
    console.log('Renderer.updateTimelineInfo', data);
    
    if (this.currentRenderer && this.currentRendererIsTimeline) {
      if ('playing' in data) {
        this.updateTimelinePlaybackStatus(data.playing);
      }
      if ('position' in data) {
        this.currentRenderer.setPosition(data.position);
      }
    }
  }
  
  updateTimelinePlaybackStatus = (playing) => {
    if (playing && !this.ticker.running) {
      this.playing = true;
      this.ticker.start();
    } else if (!playing && this.ticker.running) {
      this.playing = false;
      this.ticker.stop();
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
          playing: this.playing,
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

    // const dmx = this.outputs.dmx;
    const dmx = this.outputs.artnet;
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
