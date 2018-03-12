const DMX = require('dmx');
const Device = require('./Device');

const devices = [];
for (let i = 0; i < 4; i++) {
  devices.push(new Device(
    (i * 8),
    8,
    {
      1: 0,
      2: 0,
      3: 8,
      // 3: 120,
      4: 8,
      // 5: Math.round(Math.random()*127),
      5: [85,71][+(i % 2 === 0)],
      6: 0,
      7: 32,
      8: 0,
    },
    {
      tilt: 0,
      pan: (i * 0.4),
    },
  ));
}

const dmx = new DMX();
dmx.addUniverse('main', 'enttec-usb-dmx-pro', '/dev/tty.usbserial-EN086444');

setInterval(() => {
  devices.forEach((device) => {
    let tilt = device.getVar('tilt');
    let pan = device.getVar('pan');
    tilt += 0.05;
    pan += 0.01;
    device.setVar('pan', pan);
    device.setVar('tilt', tilt);
    device.setChannel(1, 127 + (Math.round(Math.sin(pan) * 127)));
    // device.setChannel(2, 127 + (Math.round(Math.cos(tilt) * 127)));
  });

  const allData = devices.reduce((obj, device) => ({
    ...obj,
    ...Object.entries(device.data).reduce((data, [channel, value]) => ({
      ...data,
      [Number(channel) + device.startingChannel]: value,
    }), {}),
  }), {});
  dmx.update('main', allData);
}, (1 / 30) * 1000)
