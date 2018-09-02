import fs from 'fs';
import wav from 'wav';

export default class AudioRenderer {
  started = false;
  fileStream = null;
  wavReader = null;
  
  constructor(sourceFile) {
    this.fileStream = fs.createReadStream(sourceFile);
    this.wavReader = new wav.Reader();
    
    // The "format" event gets emitted at the end of the WAVE header
    // this.wavReader.on('format', (format) => {
    //   // The WAVE header is stripped from the output of the reader
    //   this.wavReader.pipe(new Speaker(format));
    // });
    this.fileStream.pipe(this.wavReader);
  }
  
  reset = () => {
    this.started = false;
  }
  
  render = (delta, blockInfo = {}) => {
    this.started = true;
    
    // @TODO
    
    return this.wavReader;
  }
}