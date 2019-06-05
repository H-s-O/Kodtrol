import timeToQuarter from '../../../lib/timeToQuarter';

export default class BaseRootRenderer {
    _providers = null;
    _currentTime = 0;
    _currentBeatPos = -1;
    _beatExecQueue = null;
    _frameExecQueue = null;
    _inputExecQueue = null;

    constructor(provider) {
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
            this._beatExecQueue = [];
            this.prepareBeat(beatPos);
            this.runBeat();
        }
    }

    frame = () => {
        this._frameExecQueue = [];
        this._prepareFrame(this._currentTime);
        this._runFrame();
    }

    _prepareFrame = () => {
        // implement in subclass
    }

    _addToFrameQueue = (func) => {
        this._frameExecQueue.push(func);
    }
    
    _runFrame = () => {
        for (let f of this._frameExecQueue) {
            f();
        }
    }

    _prepareBeat = (beatPos) => {
        // implement in subclass
    }

    _addToBeatQueue = (func) => {
        this._beatExecQueue.push(func);
    }

    _runBeat = () => {
        for (let f of this._beatExecQueue) {
            f();
        }
    }

    input = (type, data) => {
        this._inputExecQueue = [];
        this._prepareInput(type, data);
        this._runInput();
    }

    _prepareInput = (type, data) => {
        // implement in subclass
    }

    _addToInputQueue = (func) => {
        this._inputExecQueue.push(func);
    }

    _runInput = () => {
        for (let f of this._inputExecQueue) {
            f();
        }
    }

    _getRenderingTempo = () => {
        // implement in subclass
    }

    destroy = () => {
        this._providers = null;
        this._beatExecQueue = null;
        this._frameExecQueue = null;
        this._inputExecQueue = null;
    }
}
