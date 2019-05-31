export default class Ticker {
  frameCallback = null;
  beatCallback = null;
  tickCallback = null;
  bpm = null;
  interval = null;
  framerateDelay = null;
  beatDelay = null;
  lastFrameTime = null;
  lastBeatTime = null;
  
  constructor(tickCallback, frameCallback, beatCallback, bpm) {
    this.tickCallback = tickCallback;
    this.frameCallback = frameCallback;
    this.beatCallback = beatCallback;
    this.bpm = bpm;
    
    this.framerateDelay = (1 / 40) * 1000;
    // @source https://stackoverflow.com/a/9675073
    this.beatDelay = ((1000 * 60) / this.bpm) / 24.0;
  }

  // getTime = () => {
  //   // @see https://github.com/livejs/midi-clock/blob/master/tick.js#L14
  //   const t = process.hrtime();
  //   return (t[0] + (t[1] / Math.pow(10, 9))) * 1000;
  // }
  
  start = () => {
    if (!this.running) {
      this.lastFrameTime = this.lastBeatTime = Date.now();
      this.tick(); // initial tick
      this.interval = setInterval(this.tick, 5);
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

    // const beatDiff = time - this.lastBeatTime;
    // if (beatDiff >= this.beatDelay) {
    //   const diffCount = Math.floor(beatDiff / this.beatDelay);
    //   this.beatCallback(diffCount);
    //   this.lastBeatTime = time;
    // }
    
    // const frameDiff = time - this.lastFrameTime;
    // if (frameDiff >= this.framerateDelay) {
      // this.frameCallback(frameDiff);
      // this.lastFrameTime = time;
      // this.lastFrameTime = time;
      // }
      
      const frameDiff = time - this.lastFrameTime;
      this.tickCallback(frameDiff);
      this.lastFrameTime = time;
  }
  
  destroy = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.frameCallback = null;
    this.beatCallback = null;
    this.tickCallback = null;
  }
}