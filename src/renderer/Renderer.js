import { getCompiledScriptPath } from './lib/fileSystem';
import Ticker from './lib/Ticker';
import MidiInput from './inputs/MidiInput';
import OscInput from './inputs/OscInput';
import DmxOutput from './outputs/DmxOutput';
import ArtnetOutput from './outputs/ArtnetOutput';
import AudioOutput from './outputs/AudioOutput';
import Store from './data/Store';
import * as StoreEvent from './events/StoreEvent';
import ScriptRenderer from './rendering/renderers/ScriptRenderer';
import TimelineRenderer from './rendering/renderers/TimelineRenderer';
import Device from './rendering/Device';
import DeviceProxy from './rendering/DeviceProxy';
import Script from './rendering/Script';

export default class Renderer {
  store = null;
  outputs = {};
  inputs = {};
  devices = {};
  scripts = {};
  currentScript = null;
  currentRenderer = null;
  ticker = null;
  state = null;
  dmxBaseData = null;
  currentRendererIsTimeline = false;
  playing = false;
  
  constructor() {
    // this.store = new Store();
    // this.store.on(StoreEvent.DEVICE_CHANGED, this.onDeviceChanged);
    
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
    if ('updateDevices' in message) {
      const { updateDevices } = message;
      this.updateDevices(updateDevices);
    } else if ('updateScripts' in message) {
      const { updateScripts } = message;
      this.updateScripts(updateScripts);
    } else if ('previewScript' in message) {
      const { previewScript } = message;
      this.previewScript(previewScript);
    }
    
    // else if ('updateRenderer' in message) {
    //   const { updateRenderer } = message;
    //   this.updateRenderer(updateRenderer);
    // } else if ('timelineInfo' in message) {
    //   const { timelineInfo } = message;
    //   this.updateTimelineInfo(message.timelineInfo);
    //   this.send({
    //     'timelineInfo': message.timelineInfo,
    //   });
    // }
  }
  
  updateDevices = (data) => {
    this.devices = data.reduce((devices, device) => {
      const { id } = device;
      // update existing
      if (id in devices) {
        devices[id].update(device);
        return devices;
      }
      // new
      else {
        return {
          ...devices,
          [id]: new Device(device),
        };
      }
    }, this.devices || {});
    
    console.log('RENDERER updateDevices', this.devices);
    // this.updateDmxBaseData();
  }
  
  updateScripts = (data) => {
    this.scripts = data.reduce((scripts, script) => {
      const { id } = script;
      // update existing
      if (id in scripts) {
        scripts[id].update(script);
        return scripts;
      }
      // new
      else {
        return {
          ...scripts,
          [id]: new Script(script),
        };
      }
    }, this.scripts || {});
    console.log('RENDERER updateScripts', this.scripts);
  }
  
  previewScript = (id) => {
    if (id === null || (this.currentScript && this.currentScript.script.id !== id)) {
      if (this.currentScript) {
        this.currentScript.destroy();
        this.currentScript = null;
      }
    }
    
    if (id !== null) {
      const script = this.getScript(id);
      const devices = this.getDevices(script.devices);
      const renderer = new ScriptRenderer(script, devices);
      
      this.currentScript = renderer;
      this.updateTicker(script.tempo);
    } else {
      this.updateTicker();
    }
  }
  
  runTimeline = (id) => {
    // this.updateTimelinePlaybackStatus();
  }
  
  runBoard = (id) => {
    
  }
  
  updateTicker = (tempo = null) => {
    if (this.ticker) {
      this.ticker.destroy();
      this.ticker = null;
    }
    
    if (this.currentScript) {
      if (!this.ticker) {
        this.ticker = new Ticker(this.tickerFrame, this.tickerBeat, tempo || 120);
        this.ticker.start();
      }
    }
  }
  
  getScript = (scriptId) => {
    return this.scripts[scriptId];
  }
  
  getDevices = (devicesList) => {
    return devicesList.map((id) => {
      return new DeviceProxy(this.devices[id]);
    });
  }
  
  updateRenderer = (data) => {
    // this.store.update(data);
    
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
    this.resetDevices();
    
    this.currentScript.render(delta);

    const devicesData = this.getDevicesData();
    // console.log(Object.values(this.devices).map(({channels}) => channels));
    // console.log(devicesData);
    this.updateDmx(devicesData);
    // this.updateAudio(renderData.audio);
    
    if (this.currentRendererIsTimeline) {
      this.send({
        timelineInfo: {
          position: this.currentRenderer.currentTime,
          playing: this.playing,
        },
      });
    }
  }
  
  resetDevices = () => {
    Object.values(this.devices).forEach((device) => {
      device.resetChannels();
    });
  }
  
  getDevicesData = () => {
    return Object.values(this.devices).reduce((obj, {channels, startingChannel}) => ({
      ...obj,
      ...Object.entries(channels).reduce((obj2, [channel, channelValue]) => {
        return {
          ...obj2,
          [startingChannel + Number(channel)]: channelValue,
        };
      }, {}),
    }), {});
  }
  
  tickerBeat = (beat, delta) => {
    if (this.currentScript) {
      this.currentScript.beat(beat, delta);
    }
  }
  
  onMidiInput = (data) => {
    if (this.currentScript) {
      this.currentScript.input('midi', data);
    }
  }
  
  onOscInput = (data) => {
    if (this.currentScript) {
      this.currentScript.input('osc', data);
    }
  }
  
  updateDmx = (data = null) => {
    // const allData = {
    //   ...this.dmxBaseData,
    //   ...data,
    // };

    // const dmx = this.outputs.dmx;
    const dmx = this.outputs.artnet;
    dmx.send(data);
  }
  
  updateAudio = (data = null) => {
    const audio = this.outputs.audio;
    audio.send(data);
  }
  
  // updateDmxBaseData = () => {
  //   this.dmxBaseData = this.devices.reduce((obj, {channelDefaults, startChannel}) => ({
  //     ...obj,
  //     ...channels.reduce((obj2, defaultValue, index) => {
  //       return {
  //         ...obj2,
  //         [Number(startChannel) + index]: defaultValue,
  //       };
  //     }, {}),
  //   }), {});
  // }
}
