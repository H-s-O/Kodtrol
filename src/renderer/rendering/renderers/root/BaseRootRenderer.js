import timeToPPQ from '../../../lib/timeToPPQ';

export default class BaseRootRenderer {
  _providers = null;
  _currentTime = 0;
  _currentBeatPos = -1;

  constructor(providers) {
    this._providers = providers;
  }

  get currentTime() {
    return this._currentTime;
  }

  tick(delta) {
    this._currentTime += delta;

    const beatPos = timeToPPQ(this._currentTime, this._getRenderingTempo());

    if (beatPos !== this._currentBeatPos) {
      if (this._currentBeatPos === -1) {
        this._runBeat(beatPos);
      } else {
        // Loop the difference between two positions; will act
        // as catch-up in case some lag occurs
        const diff = beatPos - this._currentBeatPos;
        for (let i = 0; i < diff; i++) {
          this._runBeat(this._currentBeatPos + diff);
        }
      }

      this._currentBeatPos = beatPos;
    }
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

  _runBeat(beatPos) {
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
    this._currentBeatPos = null;
  }
}
