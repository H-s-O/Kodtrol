import EventEmitter from 'events';

export default class ScriptRenderer extends EventEmitter {
  _providers = null;
  _script = null;
  _scriptInstance = null;
  _devices = null;
  _started = false;
  _scriptError = null;

  constructor(providers, scriptId) {
    super();

    this._providers = providers;

    this._setScriptAndDevices(scriptId);
  }

  _setScriptAndDevices(scriptId) {
    this._destroyScript();

    this._script = this._providers.getScript(scriptId);
    this._script.on('updated', this._onScriptUpdated.bind(this));

    this._reloadDevicesProxies();
    this._reloadScriptInstance();
  }

  get script() {
    return this._script;
  }

  get error() {
    return this._scriptError;
  }

  _reloadScriptInstance() {
    this._scriptError = null;
    this._scriptInstance = this._script.getInstance(this._handleLog.bind(this));
  }

  _reloadDevicesProxies() {
    this._destroyDevicesProxies();
    this._devices = this._providers.getDevices(this._script.devices);
  }

  _onScriptUpdated() {
    this._reloadDevicesProxies();
    this._reloadScriptInstance();

    // Clear the started flag, so that we force a restart to
    // handle possibly new content from start() hook
    this._started = false;
  }

  reset() {
    this._reloadScriptInstance();

    if (this._devices) {
      Object.values(this._devices).forEach((device) => {
        device.resetVars();
      });
    }

    this._started = false;
    this._currentBeatPos = -1;
    this._currentTime = 0;
  }

  _handleError(err, hook) {
    console.error(err);

    const message = err instanceof Error ? `${err.name}: ${err.message}` : err;

    this._scriptError = message;
    this.emit('script_error', { message, hook, script: this.script.id })
  }

  _handleLog(data) {
    this.emit('script_log', { time: Date.now(), data: data.join(' '), script: this.script.id })
  }

  _start() {
    if (!this._started) {
      if (this._script.hasStart) {
        try {
          this._scriptInstance.start(this._devices);
        } catch (err) {
          this._handleError(err, 'start')
        }
      }
      this._started = true;
    }
  }

  render(delta, info = {}, triggerData = {}, curveData = {}) {
    // Cancel if an error occured
    if (this._scriptError || !this._scriptInstance) {
      return;
    }

    const script = this._script;
    const blockPercent = 'blockPercent' in info ? info.blockPercent : null;

    if (script.hasLeadInFrame && blockPercent !== null && blockPercent < 0) {
      this._start();

      try {
        this._scriptInstance.leadInFrame(this._devices, info, triggerData, curveData);
      } catch (err) {
        this._handleError(err, 'leadInFrame')
      }
    } else if (script.hasLeadOutFrame && blockPercent !== null && blockPercent > 1) {
      this._start();

      try {
        this._scriptInstance.leadOutFrame(this._devices, info, triggerData, curveData);
      } catch (err) {
        this._handleError(err, 'leadOutFrame')
      }
    } else if (script.hasFrame && (blockPercent === null || (blockPercent >= 0 && blockPercent <= 1))) {
      this._start();

      try {
        this._scriptInstance.frame(this._devices, info, triggerData, curveData);
      } catch (err) {
        this._handleError(err, 'frame')
      }
    }
  }

  beat(beatPos, localBeatPos = null) {
    // Cancel if an error occured
    if (this._scriptError || !this._scriptInstance) {
      return;
    }

    if (this._script.hasBeat) {
      this._start();

      const beatInfo = {
        localBeat: localBeatPos !== null ? localBeatPos : beatPos,
        globalBeat: beatPos,
      };

      try {
        this._scriptInstance.beat(this._devices, beatInfo);
      } catch (err) {
        this._handleError(err, 'beat')
      }
    }
  }

  input(type, inputData) {
    // Cancel if an error occured
    if (this._scriptError || !this._scriptInstance) {
      return;
    }

    if (this._script.hasInput) {
      this._start();

      try {
        this._scriptInstance.input(this._devices, type, inputData);
      } catch (err) {
        this._handleError(err, 'input')
      }
    }
  }

  _destroyScript() {
    if (this._script) {
      this._script.removeAllListeners('updated');
    }
  }

  _destroyDevicesProxies() {
    if (this._devices) {
      Object.values(this._devices).forEach((device) => {
        device.destroy();
      });
    }
  }

  destroy() {
    this._destroyScript();
    this._destroyDevicesProxies();

    this._script = null;
    this._providers = null;
    this._scriptInstance = null;
    this._devices = null;
    this._started = null;
    this._scriptError = null;
  }
}
