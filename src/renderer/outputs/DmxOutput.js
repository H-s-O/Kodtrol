import DMX from 'dmx';

export default class DmxOutput {
  output = null;
  
  constructor(driver, port) {
    this.output = new DMX();
    this.output.addUniverse('main', driver, port);
    console.log('DMX output');
  }
  
  send = (data) => {
    this.output.update('main', data);
  }
  
  destroy = () => {
    if (this.output) {
      // Manually stop universes
      Object.values(this.output.universes).forEach((universe) => universe.stop());
    }
    
    this.output = null;
  }
}