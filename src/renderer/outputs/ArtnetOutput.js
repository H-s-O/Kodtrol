import artnet from 'artnet';

export default class ArtnetOutput {
  output = null;
  
  constructor() {
    this.output = artnet({
      host: '192.168.0.109',
      sendAll: true, // skips sending/updating some channels without this :(
    });
  }
  
  send = (data) => {
    const outputArr = [];
    for (let i = 0; i < 512; i++) {
      if (data && i in data) {
        let val = data[i];
        val = val < 0 ? 0 : val > 255 ? 255 : val;
        outputArr[i] = val >> 0;
      } else {
        outputArr[i] = 0;
      }
    }
    
    this.output.set(0, outputArr);
  }
  
  destroy = () => {
    if (this.output) {
      this.output.close();
    }
    this.output = null;
  }
}