import EventEmitter from 'events';

export default class BaseRootRenderer extends EventEmitter {
  _providers = null;
  _currentTime = 0;

  constructor(providers) {
    super();

    this._providers = providers;
  }

  public get currentTime(): number {
    return this._currentTime;
  }

  public tick(delta: number): void {
    this._currentTime += delta;

    this._runBeat(this._currentTime, this._currentTime - delta);
  }

  public frame(): void {
    this._runFrame(this._currentTime);
  }

  public input(type, data): void {
    this._runInput(type, data);
  }

  protected _runFrame(frameTime): void {
    // implement in subclass
  }

  protected _runBeat(beatTime, previousBeatTime): void {
    // implement in subclass
  }

  protected _runInput(type, data): void {
    // implement in subclass
  }

  protected _getRenderingTempo(): number | null | void {
    // implement in subclass
  }

  protected _forwardEvent(eventName, additionalInfo = null): void {
    return (info) => this.emit(eventName, additionalInfo ? { ...info, ...additionalInfo } : info);
  }

  public destroy(): void {
    this._providers = null;
  }
}
