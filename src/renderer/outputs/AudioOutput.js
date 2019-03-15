import AudioSubProcess from '../process/AudioSubProcess';

export default class AudioOutput {
  audioSubProcess = null;
  
  constructor() {
    this.audioSubProcess = new AudioSubProcess();
    console.log('Audio output');
  }
  
  // temp
  flush = () => {
    
  }
  
  send = (data) => {
    if (this.audioSubProcess) {
      this.audioSubProcess.send(data);
    }
  }
  
  destroy = () => {
    if (this.audioSubProcess) {
      this.audioSubProcess.destroy();
    }
    this.audioSubProcess = null;
  }
}