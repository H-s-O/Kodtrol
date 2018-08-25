import path from 'path';

import { getCompiledScriptPath } from './lib/fileSystem';
import Device from './Device';

export default class ScriptRenderer {
  outputs = null;
  scriptInstance = null;
  devicesInstances = null;
  started = false;
  outputData = {};
  scriptData = {};
  
  constructor(outputs, sourceScript, sourceDevices) {
    this.outputs = outputs;
    
    const { id, devices, previewTempo } = sourceScript;
    const scriptPath = getCompiledScriptPath(id);

    this.scriptInstance = new (require(scriptPath))();
    this.devicesInstances = devices.map(({id: deviceId}) => {
      const deviceData = sourceDevices.find(({id: sourceDeviceId}) => sourceDeviceId === deviceId);
      return new Device(deviceData);
    });
  }
  
  reset = () => {
    this.scriptData = {};
    this.outputData = {};
    this.started = false;
  }

  render = (blockInfo = {}, triggerData = {}) => {
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
  
  beat = (beat) => {
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

  destroy = () => {
    this.outputs = null;
    this.script = null;
    this.devices = null;
  }
}
