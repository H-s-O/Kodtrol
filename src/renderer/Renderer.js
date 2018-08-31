import DMX from 'dmx';

import { getCompiledScriptPath } from './lib/fileSystem';
import ScriptRenderer from './ScriptRenderer';
import TimelineRenderer from './TimelineRenderer';
import Ticker from './lib/Ticker';
import MidiInput from './inputs/MidiInput';
import OscInput from './inputs/OscInput';

export default class Renderer {
  outputs = {};
  inputs = {};
  currentRenderer = null;
  ticker = null;
  state = null;
  dmxBaseData = null;
  currentRendererIsTimeline = false;
  
  constructor() {
    const dmx = new DMX();
    dmx.addUniverse('main', 'enttec-usb-dmx-pro', '/dev/tty.usbserial-EN086444');
    this.outputs.dmx = dmx;
    
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
  }
  
  updateTimelineInfo = (data) => {
    if (this.currentRenderer && this.currentRendererIsTimeline) {
      if ('position' in data) {
        this.currentRenderer.setPosition(data.position);
      }
    }
  }
  
  send = (data) => {
    process.send(data);
  }
  
  tickerFrame = (time) => {
    const renderData = this.currentRenderer.render(time);
    
    this.updateDmx(renderData.dmx);
    
    if (this.currentRendererIsTimeline) {
      this.send({
        timelineInfo: {
          position: this.currentRenderer.currentTime,
        },
      });
    }
  }
  
  tickerBeat = (beat, time) => {
    if (this.currentRenderer) {
      this.currentRenderer.beat(beat, time);
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
    dmx.update('main', allData);
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
