export default class ScriptRenderer {
  _providers = null;
  _script = null;
  _devices = null;
  _started = false;
  _scriptData = {};
  
  constructor(providers, scriptId) {
    this._providers = providers;

    this._setScriptAndDevices(scriptId);
  }
  
  _setScriptAndDevices = (scriptId) => {
    this._script = this._providers.getScript(scriptId);
    this._devices = this._providers.getDevices(this._script.devices);
  }

  get script() {
    return this._script;
  }
  
  reset = () => {
    Object.values(this._devices).forEach((device) => {
      // device.resetChannels();
      device.resetVars();
    });
    
    this._scriptData = {};
    this._started = false;
    this._currentBeatPos = -1;
    this._currentTime = 0;
  }

  _start = () => {
    if (!this._started) {
      if (this._script.hasStart) {
        try {
          const data = this._script.scriptInstance.start(this._devices);
          if (typeof data !== 'undefined') {
            this._scriptData = data;
          }
        } catch (err) {
          console.error(err); // @TODO feedback to UI
        }
      }
      this._started = true;
    }
  }
  
  render = (delta, info = {}, triggerData = {}, curveData = {}) => {
    this._start();

    const script = this._script;
    const blockPercent = 'blockPercent' in info ? info.blockPercent : null;

    if (script.hasLeadInFrame && blockPercent !== null && blockPercent < 0) {
      try {
        const data = script.scriptInstance.leadInFrame(this._devices, this._scriptData, info, triggerData, curveData);
        if (typeof data !== 'undefined') {
          this._scriptData = data;
        }
      } catch (err) {
        console.error(err); // @TODO feedback to UI
      }
    } else if (script.hasLeadOutFrame && blockPercent !== null && blockPercent > 1) {
      try {
        const data = script.scriptInstance.leadOutFrame(this._devices, this._scriptData, info, triggerData, curveData);
        if (typeof data !== 'undefined') {
          this._scriptData = data;
        }
      } catch (err) {
        console.error(err); // @TODO feedback to UI
      }
    } else if (script.hasFrame && (blockPercent === null || (blockPercent >= 0 && blockPercent <= 1))) {
      try {
        const data = script.scriptInstance.frame(this._devices, this._scriptData, info, triggerData, curveData);
        if (typeof data !== 'undefined') {
          this._scriptData = data;
        }
      } catch (err) {
        console.error(err); // @TODO feedback to UI
      }
    } 
  }

  beat = (beatPos, localBeatPos = null) => {
    if (this._script.hasBeat) {
      this._start();

      let localBeat;
      if (localBeatPos !== null) {
        localBeat = localBeatPos;         
      } else {
        localBeat = beatPos;
      }
      const beatInfo = { 
        localBeat,
        globalBeat: beatPos,
      };

      try {
        const data = this._script.scriptInstance.beat(this._devices, beatInfo, this._scriptData);
        if (typeof data !== 'undefined') {
          this._scriptData = data;
        }
      } catch (err) {
        console.error(err); // @TODO feedback to UI
      }
    }
  }
  
  input = (type, inputData) => {
    if (this._script.hasInput) {
      this._start();

      try {
        const data = this._script.scriptInstance.input(this._devices, type, inputData, this._scriptData);
        if (typeof data !== 'undefined') {
          this._scriptData = data;
        }
      } catch (err) {
        console.error(err); // @TODO feedback to UI
      }
    }
  }

  destroy = () => {
    this._script = null;
    this._devices = null;
    this._scriptData = null;
  }
}