import Speaker from 'speaker';

export default class AudioOutput {
  output = null;
  activeStreams = {};
  
  constructor() {
    this.output = new Speaker();
  }
  
  send = (data) => {
    if (this.output) {
      // @TODO many streams could be present, but for now, just output the first one
      let first = true;
      Object.entries(data).forEach(([id, stream]) => {
        if (id in this.activeStreams) {
          return;
        }
        
        if (!first) return;
        stream.pipe(this.output);
        this.activeStreams[id] = true;
        first = false;
      });
    }
  }
  
  destroy = () => {
    if (this.output) {
      this.output.close();
    }
    this.output = null;
  }
}