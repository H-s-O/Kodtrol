export default class Ticker {
  tickCallback = null;
  interval = null;
  lastTime = null;
  
  constructor(tickCallback) {
    this.tickCallback = tickCallback;
  }
  
  start = () => {
    if (!this.running) {
      this.lastTime = Date.now();
      this.tick(true); // initial tick
      this.interval = setInterval(this.tick, 0);
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
  
  tick = (initial = false) => {
    const time = Date.now();
    const diff = time - this.lastTime;
    this.tickCallback(diff, initial);
    this.lastTime = time;
  }
  
  destroy = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.tickCallback = null;
  }
}