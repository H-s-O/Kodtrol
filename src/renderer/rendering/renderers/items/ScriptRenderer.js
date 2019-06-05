import timeToQuarter from '../../../lib/timeToQuarter';

export default class ScriptRenderer {
  _providers = null;
  _script = null;
  _devices = null;
  _standalone = true;
  _setuped = false;
  _started = false;
  _scriptData = {};
  
  constructor(providers, scriptId, standalone = true) {
    this._providers = providers;
    this._standalone = standalone;
    
    this._setScriptAndDevices(scriptId);
  }
  
  _setScriptAndDevices = (scriptId) => {
    this._script = this._providers.getScript(scriptId);
    this._devices = this._providers.getDevices(this._script.devices);
  }
  
  reset = () => {
    Object.values(this._devices).forEach((device) => {
      // device.resetChannels();
      device.resetVars();
    });
    
    this._scriptData = {};
    this._setuped = false;
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
          console.error(err);
        }
      }
      this._started = true;
    }
  }
  
  render = (delta, info = {}, triggerData = {}, curveData = {}) => {
    this._start();


    const script = this._script;
           
    // Standalone setup
    if (this._standalone) {
      if (script.hasSetup && !this._setuped) {
        try {
          const data = script.scriptInstance.setup(this._devices, this._scriptData);
          if (data) {
            this._scriptData = data;
          }
        } catch (err) {
          console.error(err);
        }
        this._setuped = true;
      }
    }
    // In-timeline setup
    else {
      // If in setup period
      const early = info.blockPercent < 0;
      // If has setup
      if (script.hasSetup && (early || !this._setuped)) {
        try {
          const data = script.scriptInstance.setup(this._devices, this._scriptData);
          if (data) {
            this._scriptData = data;
          }
        } catch (err) {
          console.error(err);
        }
        this._setuped = true;
        if (early) {
          return;
        }
      } 
      // Has no setup, but we need to stop early
      else if (!script.hasSetup && early) {
        return;
      }
    }
  
    // Start
    

    // Frame
    if (script.hasFrame) {
      try {
        const data = script.scriptInstance.frame(this._devices, this._scriptData, info, triggerData, curveData);
        if (typeof data !== 'undefined') {
          this._scriptData = data;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  beat = (beatPos, parentTime = null, parentTempo = null) => {
    if (this._script.hasBeat) {
      this._start();

      let localBeat;
      if (this._standalone) {
        localBeat = beatPos;         
      } else {
        localBeat = timeToQuarter(parentTime, parentTempo);
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
        console.error(err);
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
        console.error(err);
      }
    }
  }

  destroy = () => {
    this._script = null;
    this._devices = null;
    this._scriptData = null;
  }
}
