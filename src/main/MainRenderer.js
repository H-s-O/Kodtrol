const DMX = require('dmx');
const Device = require('./Device');
const MidiClock = require('midi-clock')
const autoBind = require('auto-bind-inheritance');

export default class MainRenderer {
  constructor() {
    autoBind(this);

    this.running = false;

    this.clock = MidiClock();
    this.clock.setTempo(96);

    this.dmx = new DMX();
    this.dmx.addUniverse('main', 'enttec-usb-dmx-pro', '/dev/tty.usbserial-EN086444');

    this.script = null;

    const devices = [];
    for (let i = 0; i < 4; i++) {
      devices.push(new Device(
        (i * 8),
        8,
        {
          1: 0,
          2: 0,
          3: 0,
          4: 8,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
        },
        {
          tilt: (i * 0.4),
          pan: (i * 0.6),
          dimmer: i === 0 ? 200 : 32,
          dimmerFollow: i === 0 ? 200 : 32,
          panMult: (i === 0 || i === 2) ? -1 : 1,
          tiltMult: (i === 0 || i === 2) ? -1 : 1,
          color: 85,
          // color: 1,
        },
      ));
    }
    this.devices = devices;
  }

  run() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.clock.on('position', this.triggerClock);
    this.clock.start();
    setInterval(this.render, (1 / 40) * 1000);
  }

  triggerClock(time) {
      if (this.script && typeof this.script.beat === 'function') {
        this.script.beat(this.devices, time);
      }
  }

  render() {
    if (this.script && typeof this.script.loop === 'function') {
      this.script.loop(this.devices);
    }

    const allData = this.devices.reduce((obj, device) => ({
      ...obj,
      ...Object.entries(device.data).reduce((data, [channel, value]) => ({
        ...data,
        [Number(channel) + device.startingChannel]: value,
      }), {}),
    }), {});
    this.dmx.update('main', allData);
  }

  reloadScript(scriptPath) {
    delete require.cache[scriptPath];
    const scriptClass = require(scriptPath);
    this.script = new scriptClass;
    if (typeof this.script.start === 'function') {
      this.script.start(this.devices);
    }
  }
}
