import DMX from 'dmx';

export default class DmxOutput {
  output = null;
  
  constructor(driver, port) {
    this.output = new DMX();
    this.output.addUniverse('main', driver, port);
  }
  
  send = (data) => {
    this.output.update('main', data);
  }
  
  destroy = () => {
    this.output = null;
  }
}