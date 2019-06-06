import timeToQuarter from '../../../lib/timeToQuarter';

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

    tick = (delta) => {
        this._currentTime += delta;

        const beatPos = timeToQuarter(this._currentTime, this._getRenderingTempo());
        
        if (beatPos !== this._currentBeatPos) {
            this._currentBeatPos = beatPos;
            this._runBeat(beatPos);
        }
    }

    frame = () => {
        this._runFrame(this._currentTime);
    }

    input = (type, data) => {
        this._runInput(type, data);
    }
    
    _runFrame = (frameTime) => {
        // implement in subclass
    }

    _runBeat = (beatPos) => {
        // implement in subclass
    }

    _runInput = (type, data) => {
        // implement in subclass
    }

    _getRenderingTempo = () => {
        // implement in subclass
    }

    destroy = () => {
        this._providers = null;
    }
}
