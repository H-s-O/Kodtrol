import BaseRootRenderer from './BaseRootRenderer';
import ScriptRenderer from '../items/ScriptRenderer';
import timeToPPQ from '../../../lib/timeToPPQ';

export default class RootScriptRenderer extends BaseRootRenderer {
  _instance = null;

  constructor(providers, scriptId) {
    super(providers);

    this._setScriptInstance(scriptId);
  }

  _setScriptInstance(scriptId) {
    this._instance = new ScriptRenderer(this._providers, scriptId);
    this._instance.on('script_error', this._forwardEvent('script_error'))
    this._instance.on('script_log', this._forwardEvent('script_log'))
  }

  get script() {
    return this._instance;
  }

  _getRenderingTempo() {
    return this._instance.script.tempo;
  }

  _runFrame(frameTime) {
    this._instance.render(frameTime);
  }

  _runBeat(beatTime, previousBeatTime) {
    const tempo = this._getRenderingTempo();
    const prevBeatPos = timeToPPQ(previousBeatTime, tempo);
    const currentBeatPos = timeToPPQ(beatTime, tempo);

    // Loop the difference between two positions; will act
    // as catch-up in case some lag occurs
    const diff = currentBeatPos - prevBeatPos;
    for (let i = 0; i < diff; i++) {
      this._instance.beat(prevBeatPos + i);
    }
  }

  _runInput(type, data) {
    this._instance.input(type, data);
  }

  destroy() {
    this._instance.removeAllListeners();
    this._instance.destroy();
    this._instance = null;

    super.destroy();
  }
}
