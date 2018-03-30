const DMX = require('dmx');
const Device = require('./Device');
const MidiClock = require('midi-clock')
const autoBind = require('auto-bind-inheritance');

export default class MainRenderer {
  constructor() {
    autoBind(this);

    this.running = false;

    this.clock = MidiClock();
    this.clock.setTempo(88);

    this.dmx = new DMX();
    this.dmx.addUniverse('main', 'enttec-usb-dmx-pro', '/dev/tty.usbserial-EN086444');

    this.script = null;

    const devices = [];
    for (let i = 0; i < 4; i++) {
      devices.push(new Device(
        'scan',
        (i * 8),
        8
      ));
    }
    devices.push(new Device(
      'par',
      51,
      1
    ));
    devices.push(new Device(
      'par',
      52,
      1
    ));
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
    try {
      if (this.script && typeof this.script.beat === 'function') {
        this.script.beat(this.devices, time);
      }
    } catch (err) {
      this.script = null;
      console.error(err);
    }
  }

  render() {
    try {
      if (this.script && typeof this.script.loop === 'function') {
        this.script.loop(this.devices);
      }
    } catch (err) {
      this.script = null;
      console.error(err);
    }

    const allData = this.devices.reduce((obj, device) => ({
      ...obj,
      ...Object.entries(device.data).reduce((data, [channel, value]) => ({
        ...data,
        [Number(channel) + device.startingChannel]: value,
      }), {}),
    }), {});
    // console.log(allData);
    this.dmx.update('main', allData);
  }

  reloadScript(scriptPath) {
    delete require.cache[scriptPath];
    const scriptClass = require(scriptPath);
    this.script = new scriptClass;
    try {
      if (typeof this.script.start === 'function') {
        this.script.start(this.devices);
      }
    } catch (err) {
      this.script = null;
      console.error(error);
    }
    this.clock.stop();
    this.clock.start();
  }
}
