import DMX from 'dmx';

export default class ArtnetOutput {
  output = null;
  
  constructor(address) {
    this.output = new DMX();
    this.output.addUniverse('main', 'artnet', address);
    console.log('Art-Net output');
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