import { getCompiledScriptPath } from './lib/fileSystem';
import Ticker from './lib/Ticker';
import MidiInput from './inputs/MidiInput';
import OscInput from './inputs/OscInput';
import DmxOutput from './outputs/DmxOutput';
import ArtnetOutput from './outputs/ArtnetOutput';
import AudioOutput from './outputs/AudioOutput';
import ScriptRenderer from './rendering/renderers/ScriptRenderer';
import TimelineRenderer from './rendering/renderers/TimelineRenderer';
import Device from './rendering/Device';
import DeviceProxy from './rendering/DeviceProxy';
import Script from './rendering/Script';
import Timeline from './rendering/Timeline';

export default class Renderer {
  outputs = {};
  inputs = {};
  devices = {};
  scripts = {};
  timelines = {};
  currentScript = null;
  currentTimeline = null;
  ticker = null;
  playing = false;
  providers = null;
  
  constructor() {
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
    
    this.providers = {
      getScript: this.getScript,
      getScripts: this.getScripts,
      getDevices: this.getDevices,
      getTimeline: this.getTimeline,
    }
    
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
  }
  
  onMessage = (message) => {
    if ('updateDevices' in message) {
      const { updateDevices } = message;
      this.updateDevices(updateDevices);
    } else if ('updateScripts' in message) {
      const { updateScripts } = message;
      this.updateScripts(updateScripts);
    } else if ('updateTimelines' in message) {
      const { updateTimelines } = message;
      this.updateTimelines(updateTimelines);
    } else if ('previewScript' in message) {
      const { previewScript } = message;
      this.previewScript(previewScript);
    } else if ('runTimeline' in message) {
      const { runTimeline } = message;
      this.runTimeline(runTimeline);
    } else if ('runBoard' in message) {
      const { runBoard } = message;
      this.runBoard(runBoard);
    } else if ('timelineInfoUser' in message) {
      const { timelineInfoUser } = message;
      this.updateTimelineInfo(timelineInfoUser);
    }
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
  
  updateTimelines = (data) => {
    this.timelines = data.reduce((timelines, timeline) => {
      const { id } = timeline;
      // update existing
      if (id in timelines) {
        timelines[id].update(timeline);
        return timelines;
      }
      // new
      else {
        return {
          ...timelines,
          [id]: new Timeline(timeline),
        };
      }
    }, this.timelines || {});
    console.log('RENDERER updateTimelines', this.timelines);
  }
  
  getScript = (scriptId) => {
    return this.scripts[scriptId];
  }
  
  getScripts = (scriptsList) => {
    return scriptsList.map((id) => {
      return this.scripts[id];
    });
  }
  
  getTimeline = (timelineId) => {
    return this.timelines[timelineId];
  }
  
  getDevices = (devicesList) => {
    return devicesList.map((id) => {
      return new DeviceProxy(this.devices[id]);
    });
  }
  
  previewScript = (id) => {
    if (id === null || (this.currentScript && this.currentScript.script.id !== id)) {
      if (this.currentScript) {
        this.currentScript.destroy();
        this.currentScript = null;
      }
    }
    
    if (id !== null) {
      const renderer = new ScriptRenderer(this.providers, id);
      
      this.currentScript = renderer;
      this.updateTicker(renderer.script.tempo);
    } else {
      this.updateTicker();
    }
    
    this.updateDmx();
    this.updateAudio();
    
    console.log('RENDERER previewScript', id);
  }
  
  runTimeline = (id) => {
    if (id === null || (this.currentTimeline && this.currentTimeline.id !== id)) {
      if (this.currentTimeline) {
        this.currentTimeline.destroy();
        this.currentTimeline = null;
      }
    }
    
    if (id !== null) {
      const renderer = new TimelineRenderer(this.providers, id);
      
      this.currentTimeline = renderer;
      this.updateTicker(renderer.timeline.tempo);
    } else {
      this.updateTicker();
    }
    
    this.updateDmx();
    this.updateAudio();
    
    console.log('RENDERER runTimeline', id);
    // this.updateTimelinePlaybackStatus();
  }
  
  runBoard = (id) => {
    this.updateDmx();
    this.updateAudio();
  }
  
  updateTicker = (tempo = null) => {
    if (this.ticker) {
      this.ticker.destroy();
      this.ticker = null;
    }
    
    if (this.currentScript || this.currentTimeline) {
      if (!this.ticker) {
        this.ticker = new Ticker(this.tickerFrame, this.tickerBeat, tempo || 120);
        this.ticker.start();
      }
    }
  }
  
  updateTimelineInfo = (data) => {
    console.log('Renderer.updateTimelineInfo', data);
    
    if (this.currentTimeline) {
      const { playing, position } = data;
      if (typeof playing !== 'undefined') {
        this.updateTimelinePlaybackStatus(playing);
      }
      if (typeof position !== 'undefined') {
        this.currentTimeline.setPosition(position);
      }
      this.send({
        'timelineInfo': data,
      });
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
    
    if (this.currentScript) {
      this.currentScript.render(delta);
    }
    if (this.currentTimeline) {
      this.currentTimeline.render(delta);
      this.send({
        timelineInfo: {
          position: this.currentTimeline.currentTime,
          playing: this.playing,
        },
      });
    }

    const devicesData = this.getDevicesData();
    // console.log(Object.values(this.devices).map(({channels}) => channels));
    // console.log(devicesData);
    this.updateDmx(devicesData);
    // this.updateAudio(renderData.audio);
  }
  
  resetDevices = () => {
    Object.values(this.devices).forEach((device) => device.resetChannels());
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
    if (this.currentTimeline) {
      this.currentTimeline.beat(beat, delta);
    }
  }
  
  onMidiInput = (data) => {
    if (this.currentScript) {
      this.currentScript.input('midi', data);
    }
    if (this.currentTimeline) {
      this.currentTimeline.input('midi', data);
    }
  }
  
  onOscInput = (data) => {
    if (this.currentScript) {
      this.currentScript.input('osc', data);
    }
    if (this.currentTimeline) {
      this.currentTimeline.input('osc', data);
    }
  }
  
  updateDmx = (data = null) => {
    // const dmx = this.outputs.dmx;
    const dmx = this.outputs.artnet;
    dmx.send(data);
  }
  
  updateAudio = (data = null) => {
    const audio = this.outputs.audio;
    audio.send(data);
  }
}
