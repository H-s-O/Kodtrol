import { AudioContext } from 'web-audio-api';
import Speaker from 'speaker';

export default class AudioOutput {
  context = null;
  speaker = null;
  activeNodes = {};
  
  constructor() {
    this.context = new AudioContext();
    this.speaker = new Speaker({
      channels: this.context.format.numberOfChannels,
      bitDepth: this.context.format.bitDepth,
      sampleRate: this.context.sampleRate,
    });
    
    this.context.outStream = this.speaker;
  }
  
  send = (data) => {
    if (this.context) {
      // @TODO many streams could be present, but for now, just speaker the first one
      let first = true;
      Object.entries(data).forEach(([id, bufferNode]) => {
        if (id in this.activeNodes) return;
        if (!first) return;
        bufferNode.connect(this.context.destination);
        bufferNode.start(0);
        this.activeNodes[id] = true;
        first = false;
      });
    }
  }
  
  destroy = () => {
    if (this.context) {
      this.context._kill();
    }
    this.context = null;
    if (this.speaker) {
      this.speaker.close();
    }
    this.speaker = null;
  }
}