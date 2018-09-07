import fs from 'fs';
import wav from 'wav';
import uniqid from 'uniqid';

import { getConvertedAudioPath } from './lib/fileSystem';

export default class AudioRenderer {
  started = false;
  sourceFile = null;
  convertedFile = null;
  fileStream = null;
  streamId = null;
  
  constructor(sourceAudio) {
    const { id, file } = sourceAudio;
    
    this.sourceFile = file;
    this.convertedFile = getConvertedAudioPath(id);
  }
  
  reset = () => {
    this.started = false;
    if (this.fileStream) {
      this.fileStream.destroy();
    }
  }
  
  render = (delta, blockInfo) => {
    if (!this.started) {
      this.streamId = uniqid();
      const { audioPercent } = blockInfo;
      let bytePos = (audioPercent * (48378992 - 1)) >> 0;
      const remainder = bytePos % 2;
      if (remainder !== 0) {
        bytePos -= remainder;
      }
      bytePos -= (2 * 44100 * 2); // speaker module delay; 2 channels, sample rate, 2 bytes (16bit)
      // bytePos -= 2000000;
      if (bytePos < 0) {
        bytePos = 0;
      }
      this.fileStream = fs.createReadStream(this.convertedFile, {
        start: bytePos,
      });
    }
    
    this.started = true;
    
    
    // @TODO
    return {
      audio: {
        [this.streamId]: this.fileStream,
      },
    };
  }
}