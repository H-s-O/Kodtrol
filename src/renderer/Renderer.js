import DMX from 'dmx';

export default class Renderer {
  outputs = {};
  
  constructor() {
    process.on('exit', this.onExit);
    
    const dmx = new DMX();
    dmx.addUniverse('main', 'enttec-usb-dmx-pro', '/dev/tty.usbserial-EN086444');
    
    this.outputs.dmx = dmx;
    
    // temp keepalive
    setInterval(() => {}, 1000);
  }
  
  onExit = () => {
    // @TODO destroy things
  }
}

