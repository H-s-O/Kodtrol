type TickCallback = (diff: number, initial: boolean) => any;

export default class Ticker {
  private _tickCallback?: TickCallback;
  private _interval?: NodeJS.Timer;
  private _lastTime?: number;

  constructor(tickCallback: TickCallback) {
    this._tickCallback = tickCallback;
  }

  public start(): void {
    if (!this.running) {
      this._lastTime = Date.now();
      this._tick(true); // initial tick
      this._interval = setInterval(this._tick.bind(this), 0);
    }
  }

  public stop(): void {
    if (this.running) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }

  public get running(): boolean {
    return Boolean(this._interval);
  }

  private _tick(initial: boolean = false): void {
    const time = Date.now();
    const diff = time - this._lastTime!;
    if (this._tickCallback) this._tickCallback(diff, initial);
    this._lastTime = time;
  }

  public destroy(): void {
    if (this._interval) {
      clearInterval(this._interval);
    }
    this._tickCallback = undefined;
    this._interval = undefined;
    this._lastTime = undefined;
  }
}
