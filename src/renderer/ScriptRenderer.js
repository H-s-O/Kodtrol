import path from 'path';

import { getCompiledScriptPath } from './lib/fileSystem';
import Device from './Device';

export default class ScriptRenderer {
  scriptInstance = null;
  devicesInstances = null;
  started = false;
  scriptData = {};
  
  constructor(sourceScript, sourceDevices) {
    const { id, devices } = sourceScript;
    
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
    
    this.resetDevices();
  }
  
  resetDevices = (resetVars = true) => {
    this.devicesInstances.forEach((device) => device.reset(resetVars));
  }
  
  setAccumulatedChannels = (data) => {
    // @TODO
  }

  render = (time, blockInfo = {}, triggerData = {}) => {
    const script = this.scriptInstance;

    // Script start
    if (!this.started) {
      try {
        if (typeof script.start === 'function') {
          const data = script.start(this.devicesInstances, triggerData);
          if (data) {
            this.scriptData = data;
          }
        }
      } catch (err) {
        console.error(err);
      }
      this.started = true;
    }
    
    this.resetDevices(false);
    
    // Script loop
    try {
      if (typeof script.loop === 'function') {
        const data = script.loop(this.devicesInstances, this.scriptData, blockInfo, triggerData);
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
  
  beat = (beat, time) => {
    // Script beat
    try {
      if (typeof this.scriptInstance.beat === 'function') {
        const data = this.scriptInstance.beat(this.devicesInstances, beat, this.scriptData);
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
