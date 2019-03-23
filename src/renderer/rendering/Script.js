import { getCompiledScriptPath } from '../lib/fileSystem';

export default class Script {
  _id = null;
  _tempo = 0;
  _devices = [];
  _scriptInstance = null;
  _hasSetup = false;
  _hasStart = false;
  _hasFrame = false;
  _hasBeat = false;
  _hasInput = false;
  _hash = null;
  
  constructor(sourceScript) {
    this.update(sourceScript);
  }
  
  update = (sourceScript) => {
    const {
      id,
      devices,
      previewTempo,
      hash,
    } = sourceScript;
    
    this._id = id;
    this._hash = hash;
    this._tempo = Number(previewTempo);
    
    this.setDevices(devices);
    this.setScriptInstanceAndFlags(id);
  }
  
  setDevices = (devices) => {
    // Guard
    if (!devices) {
      this._devices = [];
      return;
    }
    this._devices = devices.map(({id}) => id);
  }
  
  setScriptInstanceAndFlags = (id) => {
    const scriptPath = getCompiledScriptPath(id);
    
    // clear existing cached module before attempting load
    delete require.cache[scriptPath];
    
    try {
      const scriptInstance = new (require(scriptPath))();
      
      this._scriptInstance = scriptInstance;
      this._hasSetup = typeof scriptInstance.setup === 'function';
      this._hasStart = typeof scriptInstance.start === 'function';
      this._hasFrame = typeof scriptInstance.frame === 'function';
      this._hasBeat = typeof scriptInstance.beat === 'function';
      this._hasInput = typeof scriptInstance.input === 'function';
    } catch (e) {
      console.error(e);
    }
  }
  
  get id() {
    return this._id;
  }
  
  get scriptInstance() {
    return this._scriptInstance;
  }
  
  get tempo() {
    return this._tempo;
  }
  
  get devices() {
    return this._devices;
  }
  
  get hasSetup() {
    return this._hasSetup;
  }
  
  get hasStart() {
    return this._hasStart;
  }
  
  get hasFrame() {
    return this._hasFrame;
  }
  
  get hasBeat() {
    return this._hasBeat;
  }
  
  get hasInput() {
    return this._hasInput;
  }
  
  get hash() {
    return this._hash;
  }
  
  destroy = () => {
    this._id = null;
    this._tempo = 0;
    this._devices = [];
    this._scriptInstance = null;
    this._hasSetup = false;
    this._hasStart = false;
    this._hasFrame = false;
    this._hasBeat = false;
    this._hasInput = false;
    this._hash = null;
  }
}