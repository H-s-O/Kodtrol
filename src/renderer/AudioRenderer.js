import fs from 'fs';
import uniqid from 'uniqid';
import Volume from 'pcm-volume';

import { getConvertedAudioPath } from './lib/fileSystem';

export default class AudioRenderer {
  started = false;
  sourceFile = null;
  convertedFile = null;
  volume = 1;
  fileStream = null;
  volumeStream = null;
  streamId = null;
  duration = 0;
  id = null;
  
  constructor(sourceAudio) {
    const { id, file, volume, inTime, outTime } = sourceAudio;
    
    this.id = id;
    this.sourceFile = file;
    this.volume = Number(volume);
    this.convertedFile = getConvertedAudioPath(id);
    this.duration = outTime - inTime;
  }
  
  reset = () => {
    this.started = false;
    if (this.fileStream) {
      this.fileStream.destroy();
    }
    if (this.volumeStream) {
      this.volumeStream.destroy();
    }
    this.fileStream = null;
    this.volumeStream = null;
  }
  
  render = (delta, blockInfo) => {
    const { audioPercent } = blockInfo;
    if (!this.started) {
      this.streamId = uniqid();
    //   let bytePos = (audioPercent * (48378992 - 1)) >> 0;
    //   const remainder = bytePos % 2;
    //   if (remainder !== 0) {
    //     bytePos -= remainder;
    //   }
    //   bytePos -= (2 * 44100 * 2); // speaker module delay; 2 channels, sample rate, 2 bytes (16bit)
    //   // bytePos -= 2000000;
    //   if (bytePos < 0) {
    //     bytePos = 0;
    //   }
    //   this.fileStream = fs.createReadStream(this.convertedFile, {
    //     start: bytePos,
    //   });
    //   this.volumeStream = new Volume(this.volume);
    //   this.fileStream.pipe(this.volumeStream);
    }
    
    this.started = true;
    
    const position = audioPercent * this.duration;
    const volume = this.volume;
    
    // @TODO
    return {
      audio: {
        [this.streamId]: {
          // this.volumeStream,
          id: this.id,
          position,
          volume,
        },
      },
    };
  }
}