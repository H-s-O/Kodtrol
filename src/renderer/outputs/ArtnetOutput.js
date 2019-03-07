import artnet from 'artnet';

export default class ArtnetOutput {
  output = null;
  
  constructor(address) {
    this.output = artnet({
      host: address,
      sendAll: true, // skips sending/updating some channels without this :(
    });
    console.log('Art-Net output');
  }
  
  send = (data) => {
    // const outputArr = [];
    // for (let i = 0; i < 512; i++) {
    //   if (data && i in data) {
    //     let val = data[i];
    //     val = val < 0 ? 0 : val > 255 ? 255 : val;
    //     outputArr[i] = val >> 0;
    //   } else {
    //     outputArr[i] = 0;
    //   }
    // }
    let outputArr;
    if (data) {
      outputArr = Object.entries(data).reduce((arr, [channel, value]) => {
        let val = value;
        val = val < 0 ? 0 : val > 255 ? 255 : val;
        arr[Number(channel)] = val >> 0;
        return arr;
      }, []);
    } else {
      outputArr = [];
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