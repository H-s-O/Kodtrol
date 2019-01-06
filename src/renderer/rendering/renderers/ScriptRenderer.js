export default class ScriptRenderer {
  _rendererType = 'script';
  _providers = null;
  _script = null;
  _devices = null;
  _standalone = true;
  _setuped = false;
  _started = false;
  _localBeat = 0;
  _scriptData = {};
  
  constructor(providers, scriptId, standalone = true) {
    this._providers = providers;
    this._standalone = standalone;
    
    this.setScriptAndDevices(scriptId);
  }
  
  setScriptAndDevices = (scriptId) => {
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
    this._localBeat = 0;
  }
  
  get rendererType() {
    return this._rendererType;
  }
  
  get script() {
    return this._script;
  }
  
  render = (delta, blockInfo = {}, triggerData = {}, curveData = {}) => {        
    // Standalone setup
    if (this._standalone) {
      if (this._script.hasSetup && !this._setuped) {
        try {
          const data = this._script.scriptInstance.setup(this._devices);
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
      if (this._script.hasSetup && blockInfo.blockPercent < 0) {
        try {
          const data = this._script.scriptInstance.setup(this._devices);
          if (data) {
            this._scriptData = data;
          }
        } catch (err) {
          console.error(err);
        }
        this._setuped = true;
        return;
      }
    }
  
    // Start
    if (!this._started) {
      if (this._script.hasStart) {
        try {
          const data = this._script.scriptInstance.start(this._devices, triggerData, curveData);
          if (data) {
            this._scriptData = data;
          }
        } catch (err) {
          console.error(err);
        }
      }
      this._started = true;
    }

    // Loop
    if (this._script.hasLoop) {
      try {
        const data = this._script.scriptInstance.loop(this._devices, this._scriptData, blockInfo, triggerData, curveData);
        if (data) {
          this._scriptData = data;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  beat = (beat, delta) => {
    this._localBeat++;
    
    // Beat
    if (this._script.hasBeat) {
      const beatObject = {
        localBeat: this._localBeat,
        globalBeat: beat,
      };
      try {
        const data = this._script.scriptInstance.beat(this._devices, beatObject, this._scriptData);
        if (data) {
          this._scriptData = data;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  
  input = (type, inputData) => {
    // Input
    if (this._script.hasInput) {
      try {
        const data = this._script.scriptInstance.input(this._devices, type, inputData, this._scriptData);
        if (data) {
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
