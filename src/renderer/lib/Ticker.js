export default class Ticker {
  frameCallback = null;
  beatCallback = null;
  bpm = null;
  interval = null;
  count = -1;
  framerateDelay = null;
  lastTime = null;
  startTime = null;
  
  constructor(frameCallback, beatCallback, bpm) {
    this.frameCallback = frameCallback;
    this.beatCallback = beatCallback;
    this.bpm = bpm;
    
    this.framerateDelay = (1 / 40) * 1000;
    
  }
  
  start = () => {
    if (!this.running) {
      this.lastTime = this.startTime = Date.now();
      
      // @source https://stackoverflow.com/a/9675073
      const ms_per_beat = (1000 * 60) / this.bpm;
      const interval_24th = ms_per_beat / 24.0;
      
      this.interval = setInterval(this.tick, interval_24th);
    }
  }
  
  stop = () => {
    if (this.running) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  get running() {
    return this.interval !== null;
  }
  
  tick = () => {
    const time = Date.now();
    const diff = time - this.lastTime;
    
    this.count++;
    this.beatCallback(this.count, diff);
    
    if (diff >= this.framerateDelay) {
      this.frameCallback(diff);
      this.lastTime = time;
    }
  }
  
  destroy = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.frameCallback = null;
    this.beatCallback = null;
  }
}