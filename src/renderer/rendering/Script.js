import EventEmitter from 'events';

import { getCompiledScriptPath } from '../lib/fileSystem';

export default class Script extends EventEmitter {
  _id = null;
  _tempo = 0;
  _devices = [];
  _hasStart = false;
  _hasLeadInFrame = false;
  _hasFrame = false;
  _hasLeadOutFrame = false;
  _hasBeat = false;
  _hasInput = false;
  _hash = null;
  
  constructor(sourceScript) {
    super();
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

    this.emit('updated');
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
      
      this._hasStart = typeof scriptInstance.start === 'function';
      this._hasLeadInFrame = typeof scriptInstance.leadInFrame === 'function';
      this._hasFrame = typeof scriptInstance.frame === 'function';
      this._hasLeadOutFrame = typeof scriptInstance.leadOutFrame === 'function';
      this._hasBeat = typeof scriptInstance.beat === 'function';
      this._hasInput = typeof scriptInstance.input === 'function';
    } catch (e) {
      console.error(e);
    }
  }

  getInstance = () => {
    const scriptPath = getCompiledScriptPath(this._id);
    const instance = new (require(scriptPath))();
    return instance;
  }
  
  get id() {
    return this._id;
  }
  
  get tempo() {
    return this._tempo;
  }
  
  get devices() {
    return this._devices;
  }
  
  get hasStart() {
    return this._hasStart;
  }
  
  get hasLeadInFrame() {
    return this._hasLeadInFrame;
  }
  
  get hasFrame() {
    return this._hasFrame;
  }
  
  get hasLeadOutFrame() {
    return this._hasLeadOutFrame;
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
    this._hasSetup = false;
    this._hasStart = false;
    this._hasFrame = false;
    this._hasBeat = false;
    this._hasInput = false;
    this._hash = null;
  }
}