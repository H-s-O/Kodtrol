



const devices = [];
for (let i = 0; i < 4; i++) {
  devices.push(new Device(
    (i * 8),
    8,
    {
      1: 128,
      2: 128,
      3: 8,
      // 3: 120,
      4: 8,
      // 4: 0,
      // 5: Math.round(Math.random()*127),
      // 5: [85,71][+(i % 2 === 0)],
      5: 85,
      6: 0,
      7: 127,
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

let prevRandom = -1;
clock.on('position', (position) => {
  const microPosition = position % 24;
  // const microPosition = position % 12;
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
      // device.setVar('dimmer', index === rand ? 255 : 32);
      device.setVar('dimmer', index === rand ? 80 : 32);
      // device.setVar('color', index === rand ? 84 : 85);
    });
    prevRandom = rand;
  }
});

setInterval(() => {
  devices.forEach((device) => {
    let color = device.getVar('color');
    let tilt = device.getVar('tilt');
    let tiltMult = device.getVar('tiltMult');
    let pan = device.getVar('pan');
    let panMult = device.getVar('panMult');
    let dimmer = device.getVar('dimmer');
    let dimmerFollow = device.getVar('dimmerFollow');
    let dimmerDiff = dimmer - dimmerFollow;
    // dimmerFollow += dimmerDiff/1;
    dimmerFollow += dimmerDiff/5;
    tilt += 0.01 * tiltMult;
    pan += 0.01 * panMult;
    device.setVar('pan', pan);
    device.setVar('tilt', tilt);
    device.setVar('dimmerFollow', dimmerFollow);
    // device.setChannel(1, 127 + (Math.round(Math.sin(pan) * 127)));
    // device.setChannel(2, 127 + (Math.round(Math.cos(tilt) * 127)));
    device.setChannel(7, dimmerFollow);
    device.setChannel(5, color);
    // device.setChannel(7, dimmer - (Math.round(Math.random() * 64)));
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
