import AudioSubProcess from '../process/AudioSubProcess';
import AbstractOutput from './AbstractOutput';

export default class AudioOutput extends AbstractOutput {
  audioSubProcess = null;
  
  constructor(device) {
    super();

    // @TODO handle different audio output devices
    this.audioSubProcess = new AudioSubProcess();
    console.log('Audio output');

    this._setStatusConnected();
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