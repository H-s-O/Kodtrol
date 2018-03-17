const DMX = require('dmx');
const Device = require('./Device');
const MidiClock = require('midi-clock')

const clock = MidiClock();
clock.setTempo(96);
clock.start();

const devices = [];
for (let i = 0; i < 4; i++) {
  devices.push(new Device(
    (i * 8),
    8,
    {
      1: 127,
      2: 80,
      3: 8,
      // 3: 120,
      4: 0,
      // 4: 0,
      // 5: Math.round(Math.random()*127),
      // 5: [85,71][+(i % 2 === 0)],
      5: 0,
      6: 0,
      7: 127,
      8: 0,
    },
    {
      pan: (i * 0.6),
      panMult: (i === 0 || i === 2) ? -1 : 1,
    },
  ));
}

const dmx = new DMX();
dmx.addUniverse('main', 'enttec-usb-dmx-pro', '/dev/tty.usbserial-EN086444');

let prevRandom = -1;
clock.on('position', (position) => {
  // const microPosition = position % 24;
  const microPosition = position % 12;
  // const microPosition = position % 6;
  if (microPosition === 0) {
    // let prevDimmer = devices[devices.length - 1].getVar('dimmer');
    // devices.forEach((device) => {
    //   const savedDimmer = device.getVar('dimmer');
    //   device.setVar('dimmer', prevDimmer);
    //   prevDimmer = savedDimmer;
    // });
    let rand;
    do {
      rand = Math.round(Math.random() * 3);
    } while (rand === prevRandom);
    devices.forEach((device, index) => {
      device.setChannel(5, Math.round(Math.random() * 8) * 14);
      // device.setVar('dimmer', index === rand ? 255 : 32);
      // device.setVar('dimmer', index === rand ? 80 : 32);
      // device.setVar('color', index === rand ? 84 : 85);
    });
    prevRandom = rand;
  }
});

setInterval(() => {
  devices.forEach((device) => {
    let pan = device.getVar('pan');
    let panMult = device.getVar('panMult');
    pan += 0.1 * panMult;
    device.setVar('pan', pan);
    device.setChannel(1, 127 + (Math.round(Math.sin(pan) * 64)));
  });


  const allData = devices.reduce((obj, device) => ({
    ...obj,
    ...Object.entries(device.data).reduce((data, [channel, value]) => ({
      ...data,
      [Number(channel) + device.startingChannel]: value,
    }), {}),
  }), {});
  dmx.update('main', allData);
}, (1 / 40) * 1000)
