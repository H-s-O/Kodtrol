import { getCompiledScriptPath } from '../lib/fileSystem';

export default class Script {
  _id = null;
  _lastUpdated = null;
  _devices = [];
  _scriptInstance = null;
  _hasSetup = false;
  _hasStart = false;
  _hasLoop = false;
  _hasBeat = false;
  _hasInput = false;
  
  constructor(sourceScript) {
    this.update(sourceScript);
  }
  
  update = (sourceScript) => {
    const {
      id,
      devices,
      lastUpdated,
    } = sourceScript;
    
    this._id = id;
    this._lastUpdated = Number(lastUpdated);
    
    this.setDevices(devices);
    this.setScriptInstanceAndFlags(id);
  }
  
  setDevices = (devices) => {
    this._devices = devices.map(({id}) => id);
  }
  
  setScriptInstanceAndFlags = (id) => {
    const scriptPath = getCompiledScriptPath(id);
    
    // clear existing cached module before attempting load
    delete require.cache[scriptPath];
    
    const scriptInstance = new (require(scriptPath))();
    
    this._scriptInstance = scriptInstance;
    this._hasSetup = typeof scriptInstance.setup === 'function';
    this._hasStart = typeof scriptInstance.start === 'function';
    this._hasLoop = typeof scriptInstance.loop === 'function';
    this._hasBeat = typeof scriptInstance.beat === 'function';
    this._hasInput = typeof scriptInstance.input === 'function';
  }
  
  get scriptInstance() {
    return this._scriptInstance;
  }
  
  get hasSetup() {
    return this._hasSetup;
  }
  
  get hasStart() {
    return this._hasStart;
  }
  
  get hasLoop() {
    return this._hasLoop;
  }
  
  get hasBeat() {
    return this._hasBeat;
  }
  
  get hasInput() {
    return this._hasInput;
  }
}