import BaseRootRenderer from './BaseRootRenderer';
import ScriptRenderer from '../items/ScriptRenderer';
import timeToQuarter from '../../../lib/timeToQuarter';

export default class RootScriptRenderer extends BaseRootRenderer {
    _instance = null;

    constructor(providers, scriptId) {
        super(providers);

        this._setScriptInstance(scriptId);
    }

    _setScriptInstance = (scriptId) => {
        this._instance = new ScriptRenderer(this._providers, scriptId);
    }

    get script() {
        return this._instance;
    }

    _getRenderingTempo = () => {
        return this._instance.script.tempo;
    }

    _runFrame = (frameTime) => {
        this._instance.render(this._currentTime);
    }

    _runBeat = (beatPos) => {
        const localBeatPos = timeToQuarter(this._currentTime, this._getRenderingTempo());
        this._instance.beat(beatPos, localBeatPos);
    }

    _runInput = (type, data) => {
        this._instance.input(type, data);
    }

    destroy = () => {
        this._instance.destroy();
        this._instance = null;

        // super.destroy(); // @TODO needs babel update
    }
}
