export default class Ticker {
  _tickCallback = null;
  _interval = null;
  _lastTime = null;

  constructor(tickCallback) {
    this._tickCallback = tickCallback;
  }

  start() {
    if (!this.running) {
      this._lastTime = Date.now();
      this._tick(true); // initial tick
      this._interval = setInterval(this._tick.bind(this), 0);
    }
  }

  stop() {
    if (this.running) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  get running() {
    return this._interval !== null;
  }

  _tick(initial = false) {
    const time = Date.now();
    const diff = time - this._lastTime;
    this._tickCallback(diff, initial);
    this._lastTime = time;
  }

  destroy() {
    if (this._interval) {
      clearInterval(this._interval);
    }
    this._tickCallback = null;
    this._interval = null;
    this._lastTime = null;
  }
}
