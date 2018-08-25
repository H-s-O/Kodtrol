import DMX from 'dmx';

import { getCompiledScriptPath } from './lib/fileSystem';
import ScriptRenderer from './ScriptRenderer';
import Ticker from './lib/Ticker';

export default class Renderer {
  outputs = {};
  currentRenderer = null;
  ticker = null;
  state = null;
  baseData = null;
  
  constructor() {
    const dmx = new DMX();
    dmx.addUniverse('main', 'enttec-usb-dmx-pro', '/dev/tty.usbserial-EN086444');
    
    this.outputs.dmx = dmx;
    
    // temp keepalive
    process.on('exit', this.onExit);
    process.on('message', this.onMessage);
  }
  
  onExit = () => {
    this.destroyRendererRelated();
    this.destroy();
  }
  
  destroy = () => {
    this.outputs = null;
    this.state = null;
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
  }
  
  onMessage = (message) => {
    this.state = message;
    this.update();
  }
  
  update = () => {
    console.log('Renderer.update()');
    this.destroyRendererRelated();
    
    const { previewScript, scripts, devices } = this.state;
    
    this.baseData = this.computeBaseDmxData(devices);
    
    if (previewScript) {
      const script = scripts.find(({id}) => id === previewScript);
      const { previewTempo } = script;
      
      // temp
      delete require.cache[getCompiledScriptPath(previewScript)];
      
      this.currentRenderer = new ScriptRenderer(this.outputs, script, devices);
      this.ticker = new Ticker(this.tickerFrame, this.tickerBeat, previewTempo || 120);
      
      return;
    }
  }
  
  tickerFrame = () => {
    const renderData = this.currentRenderer.render();
    // console.log('frame', Date.now());
    
    const allData = {
      ...this.baseData,
      ...renderData.dmx,
    };
    
    const dmx = this.outputs.dmx;
    dmx.update('main', allData);
  }
  
  tickerBeat = (beat) => {
    this.currentRenderer.beat(beat);
    // console.log('beat', beat);
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

