export default class BaseRootRenderer {
  _providers = null;
  _currentTime = 0;

  constructor(providers) {
    this._providers = providers;
  }

  get currentTime() {
    return this._currentTime;
  }

  tick(delta) {
    this._currentTime += delta;

    this._runBeat(this._currentTime, this._currentTime - delta);
  }

  frame() {
    this._runFrame(this._currentTime);
  }

  input(type, data) {
    this._runInput(type, data);
  }

  _runFrame(frameTime) {
    // implement in subclass
  }

  _runBeat(beatTime, previousBeatTime) {
    // implement in subclass
  }

  _runInput(type, data) {
    // implement in subclass
  }

  _getRenderingTempo() {
    // implement in subclass
  }

  destroy() {
    this._providers = null;
    this._currentTime = null;
  }
}
