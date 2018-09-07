import Speaker from 'speaker';

export default class AudioOutput {
  output = null;
  activeStreams = {};
  
  constructor() {
    this.output = new Speaker({
      // samplesPerFrame: 64,
    });
  }
  
  send = (data) => {
    if (this.output) {
      let hasActiveStream = null;
      
      // Remove defunct streams
      for (let id in this.activeStreams) {
        if (!data || !(id in data)) {
          hasActiveStream = false;
          this.activeStreams[id].unpipe(this.output);
          delete this.activeStreams[id];
        }
      }
      
      
      if (data) {
        Object.entries(data).forEach(([id, stream]) => {
          if (!(id in this.activeStreams)) {
            hasActiveStream = true;
            stream.pipe(this.output);
            this.activeStreams[id] = stream;
          }
        });
      }
      
      if (hasActiveStream === false) {
        // this.output.close();
      }
    }
  }
  
  destroy = () => {
    if (this.output) {
      this.output.destroy();
    }
    this.output = null;
  }
}