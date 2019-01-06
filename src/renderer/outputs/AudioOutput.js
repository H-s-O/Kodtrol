import AudioSubProcess from '../process/AudioSubProcess';

export default class AudioOutput {
  audioSubProcess = null;
  
  constructor() {
    this.audioSubProcess = new AudioSubProcess();
  }
  
  send = (data) => {
    if (this.audioSubProcess) {
      this.audioSubProcess.send(data);
    }
  }
  
  destroy = () => {
    if (this.audioSubProcess) {
      this.audioSubProcess.kill();
    }
    this.audioSubProcess = null;
  }
}