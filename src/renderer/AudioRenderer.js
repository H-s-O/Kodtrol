import fs from 'fs';
import wav from 'node-wav';
import { AudioContext } from 'web-audio-api';

export default class AudioRenderer {
  started = false;
  context = null;
  bufferNode = null;
  
  constructor(sourceFile) {
    const buffer = fs.readFileSync(sourceFile);
    
    this.context = new AudioContext();
    this.context.decodeAudioData(buffer, (audioBuffer) => {
      this.bufferNode = this.context.createBufferSource();
      this.bufferNode.buffer = audioBuffer;
      this.bufferNode.loop = false;
    })
    // this.wavData = wav.decode(buffer);
  }
  
  reset = () => {
    this.started = false;
  }
  
  render = (delta, blockInfo) => {
    this.started = true;
    
    // @TODO
    
    // return this.wavData.channelData[0];
    return this.bufferNode;
  }
}