// import Speaker from 'speaker';
// import libao from 'libao';

import AudioSubProcess from '../process/AudioSubProcess';


export default class AudioOutput {
  output = null;
  activeStreams = {};
  audioSubProcess = null;
  
  constructor() {
    // this.output = new libao({
    //   channels: 2,          // 2 channels
    //   bitDepth: 16,         // 16-bit samples
    //   sampleRate: 44100,    // 44,100 Hz sample rate
    // });
    // this.output = new Speaker({
      // samplesPerFrame: 64,
    // });
    
    this.audioSubProcess = new AudioSubProcess();
  }
  
  send = (data) => {
    // if (this.output) {
    //   let hasActiveStream = null;
    // 
    //   // Remove defunct streams
    //   for (let id in this.activeStreams) {
    //     if (!data || !(id in data)) {
    //       hasActiveStream = false;
    //       this.activeStreams[id].unpipe(this.output);
    //       delete this.activeStreams[id];
    //     }
    //   }
    // 
    // 
    //   if (data) {
    //     Object.entries(data).forEach(([id, stream]) => {
    //       if (!(id in this.activeStreams)) {
    //         hasActiveStream = true;
    //         stream.pipe(this.output);
    //         this.activeStreams[id] = stream;
    //       }
    //     });
    //   }
    // 
    //   if (hasActiveStream === false) {
    //     // this.output.close();
    //   }
    // }
    if (this.audioSubProcess) {
      this.audioSubProcess.send(data);
    }
  }
  
  destroy = () => {
    if (this.output) {
      this.output.destroy();
    }
    this.output = null;
    
    if (this.audioSubProcess) {
      this.audioSubProcess.kill();
    }
    this.audioSubProcess = null;
  }
}