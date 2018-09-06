import fs from 'fs';
import wav from 'wav';
import uniqid from 'uniqid';

export default class AudioRenderer {
  started = false;
  sourceFile = null;
  fileStream = null;
  wavReader = null;
  streamId = null;
  
  constructor(sourceFile) {
    this.sourceFile = sourceFile;
    // this.fileStream = fs.createReadStream(sourceFile);
    // this.wavReader = new wav.Reader();
    
    // The "format" event gets emitted at the end of the WAVE header
    // this.wavReader.on('format', (format) => {
    //   // The WAVE header is stripped from the output of the reader
    //   this.wavReader.pipe(new Speaker(format));
    // });
    // this.fileStream.pipe(this.wavReader);
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
      this.fileStream = fs.createReadStream(this.sourceFile, {
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