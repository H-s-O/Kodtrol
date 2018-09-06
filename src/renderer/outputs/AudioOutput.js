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
      // Remove defunct streams
      for (let id in this.activeStreams) {
        if (!data || !(id in data)) {
          this.activeStreams[id].unpipe(this.output);
          delete this.activeStreams[id];
        }
      }
      
      let hasActiveStream = false;
      
      if (data) {
        Object.entries(data).forEach(([id, stream]) => {
          if (!(id in this.activeStreams)) {
            hasActiveStream = true;
            stream.pipe(this.output);
            this.activeStreams[id] = stream;
          }
        });
      }
      
      if (!hasActiveStream) {
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