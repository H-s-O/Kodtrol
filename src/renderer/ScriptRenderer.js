import path from 'path';

import { getCompiledScriptPath } from './lib/fileSystem';
import Device from './Device';

export default class ScriptRenderer {
  rendererType = 'script';
  scriptInstance = null;
  devicesInstances = null;
  started = false;
  setup = false;
  localBeat = 0;
  scriptData = {};
  scriptLastUpdated = 0;
  scriptId = null;
  
  constructor(sourceScript, sourceDevices) {
    const { id, devices, lastUpdated } = sourceScript;
    
    this.scriptLastUpdated = lastUpdated;
    this.scriptId = id;
    
    const scriptPath = getCompiledScriptPath(id);
    this.scriptInstance = new (require(scriptPath))();
    
    this.devicesInstances = devices.map(({id: deviceId}) => {
      const deviceData = sourceDevices.find(({id: sourceDeviceId}) => sourceDeviceId === deviceId);
      return new Device(deviceData);
    });
  }
  
  reset = () => {
    this.scriptData = {};
    this.started = false;
    this.setup = false;
    this.localBeat = 0;
    
    this.resetDevices();
  }
  
  resetDevices = (resetVars = true) => {
    this.devicesInstances.forEach((device) => device.reset(resetVars));
  }
  
  setAccumulatedChannels = (data) => {
    // @TODO
  }

  render = (delta, blockInfo = {}, triggerData = {}, curveData = {}) => {
    const script = this.scriptInstance;
    
    this.resetDevices(false);
    
    if (!this.setup && !('blockPercent' in blockInfo) || blockInfo.blockPercent < 0) {
      // Script setup
      try {
        if (typeof script.setup === 'function') {
          const data = script.setup(this.devicesInstances);
          if (data) {
            this.scriptData = data;
          }
        }
      } catch (err) {
        console.error(err);
      }
      this.setup = true;
      
      return {
        dmx: {
          ...this.devicesInstances.reduce((obj, device) => ({
            ...obj,
            ...Object.entries(device.data).reduce((data, [channel, value]) => ({
              ...data,
              [Number(channel) + device.startingChannel]: value,
            }), {}),
          }), {}),
        }
      }
    } else {
      // Script start
      if (!this.started) {
        try {
          if (typeof script.start === 'function') {
            const data = script.start(this.devicesInstances, triggerData, curveData);
            if (data) {
              this.scriptData = data;
            }
          }
        } catch (err) {
          console.error(err);
        }
        this.started = true;
      }
      
      // Script loop
      try {
        if (typeof script.loop === 'function') {
          const data = script.loop(this.devicesInstances, this.scriptData, blockInfo, triggerData, curveData);
          if (data) {
            this.scriptData = data;
          }
        }
      } catch (err) {
        console.error(err);
      }
      
      return {
        dmx: {
          ...this.devicesInstances.reduce((obj, device) => ({
            ...obj,
            ...Object.entries(device.data).reduce((data, [channel, value]) => ({
              ...data,
              [Number(channel) + device.startingChannel]: value,
            }), {}),
          }), {}),
        }
      }
    }
  }

  beat = (beat, delta) => {
    this.localBeat++;
    
    // Script beat
    try {
      if (typeof this.scriptInstance.beat === 'function') {
        const beatObject = {
          localBeat: this.localBeat,
          globalBeat: beat,
        };
        const data = this.scriptInstance.beat(this.devicesInstances, beatObject, this.scriptData);
        if (data) {
          this.scriptData = data;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  input = (type, inputData) => {
    // Script beat
    try {
      if (typeof this.scriptInstance.input === 'function') {
        const data = this.scriptInstance.input(this.devicesInstances, type, inputData, this.scriptData);
        if (data) {
          this.scriptData = data;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  destroy = () => {
    this.script = null;
    this.devices = null;
  }
}
