import Device from './Device';
import MidiClock from 'midi-clock';
import autoBind from 'auto-bind-inheritance';
import { pick } from 'lodash';

export default class MainRenderer {
  constructor(dmx) {
    autoBind(this);

    this.dmx = dmx;

    this.running = false;

    this.clock = MidiClock();
    this.clock.setTempo(96);

    this.interval = null;
    this.script = null;
    this.scriptData = null;
    this.devices = null;
    this.allDevices = null;
    this.baseData = {};
    //
    // const devices = [];
    // for (let i = 0; i < 4; i++) {
    //   devices.push(new Device(
    //     'scan',
    //     (i * 8),
    //     8,
    //     {
    //       pan: 1,
    //       tilt: 2,
    //       shutter: 3,
    //       gobo: 4,
    //       color: 5,
    //       dimmer: 7,
    //       'function': 8,
    //     },
    //   ));
    // }
    // devices.push(new Device(
    //   'par',
    //   51,
    //   1,
    //   {
    //     dimmer: 1,
    //   },
    // ));
    // devices.push(new Device(
    //   'par',
    //   52,
    //   1,
    //   {
    //     dimmer: 1,
    //   },
    // ));
    // for (let i = 0; i < 4; i++) {
    //   devices.push(new Device(
    //     'rgb',
    //     100 + (i * 7),
    //     7,
    //     {
    //       dimmer: 1,
    //       strobe: 2,
    //       voice: 3,
    //       speed: 4,
    //       red: 5,
    //       green: 6,
    //       blue: 7,
    //     },
    //   ));
    // }
    // this.devices = devices;
  }

  run() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.clock.on('position', this.triggerClock);
    this.clock.start();
    this.interval = setInterval(this.render, (1 / 40) * 1000);
  }

  triggerClock(time) {
    try {
      if (this.script && typeof this.script.beat === 'function') {
        const data = this.script.beat(this.devices, time, this.scriptData);
        this.scriptData = data || this.scriptData;
      }
    } catch (err) {
      this.script = null;
      console.error(err);
    }
  }

  destroy() {
    clearInterval(this.interval);
    this.clock.stop();
    this.dmx = null;
  }

  render() {
    try {
      if (this.script && typeof this.script.loop === 'function') {
        const data = this.script.loop(this.devices, this.scriptData);
        this.scriptData = data || this.scriptData;
      }
    } catch (err) {
      this.script = null;
      console.error(err);
    }

    const renderData = {
      ...this.devices.reduce((obj, device) => ({
        ...obj,
        ...Object.entries(device.data).reduce((data, [channel, value]) => ({
          ...data,
          [Number(channel) + device.startingChannel]: value,
        }), {}),
      }), {}),
    };
    const allData = {
      ...this.baseData,
      ...renderData,
    };
    // console.log(this.baseData);
    // console.log(renderData);
    // console.log(allData);
    this.dmx.update('main', allData);
  }

  reloadScript(info, devices) {
    this.allDevices = devices;
    this.baseData = this.computeBaseData(devices);
    const { compiledScript: scriptPath, scriptData } = info;
    delete require.cache[scriptPath];
    const scriptClass = require(scriptPath);
    this.script = new scriptClass;
    this.devices = Object.values(pick(devices, scriptData.devices.map(({id}) => id)))
      .map((device) => new Device(
        device.name,
        device.groups,
        Number(device.startChannel),
        device.channels.length,
        device.channels
          // .filter(({alias}) => alias !== null) // @TODO fix
          .reduce((obj, channel, index) => ({
            ...obj,
            [channel.alias]: index + 1,
          }), {}),
        device.channels
          .reduce((obj, channel, index) => ({
            ...obj,
            [index]: Number(channel.defaultValue),
          }), {}),
      ));
    try {
      if (typeof this.script.start === 'function') {
        const data = this.script.start(this.devices);
        this.scriptData = data || {};
      }
    } catch (err) {
      this.script = null;
      console.error(err);
    }
    this.clock.stop();
    this.clock.start();
  }

  computeBaseData(allDevices) {
    return {
      ...Object.values(allDevices).reduce((obj, device) => ({
        ...obj,
        ...device.channels.reduce((obj2, channel, index) => {
          return {
            ...obj2,
            [Number(device.startChannel) + index]: channel.defaultValue,
          };
        }, {}),
      }), {}),
    };
  }
}