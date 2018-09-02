import DMX from 'dmx';

export default class DmxOutput {
  output = null;
  
  constructor() {
    this.output = new DMX();
    this.output.addUniverse('main', 'enttec-usb-dmx-pro', '/dev/tty.usbserial-EN086444');
  }
  
  send = (data) => {
    this.output.update('main', data);
  }
  
  destroy = () => {
    this.output = null;
  }
}