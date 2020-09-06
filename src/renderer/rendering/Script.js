import EventEmitter from 'events';
import { EOL } from 'os';

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

  update(sourceScript) {
    const {
      id,
      devices,
      devicesGroups,
      tempo,
      hash,
    } = sourceScript;

    this._id = id;
    this._hash = hash;
    this._tempo = Number(tempo);

    this._setDevices(devices, devicesGroups);
    this._setScriptFlags(id);

    this.emit('updated');
  }

  _setDevices(devices) {
    // Guard
    if (!devices) {
      this._devices = [];
      return;
    }
    this._devices = devices.map(({ device }) => device);
  }

  _handleError(err) {
    console.error(err);

    const message = err.stack.split('\n').slice(1, 5).join('\n');

    this.emit('load_error', { message, script: this.id });
  }

  _setScriptFlags(id) {
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
      this._handleError(e);
    }
  }

  getInstance(...constructorArgs) {
    const scriptPath = getCompiledScriptPath(this._id);

    try {
      const instance = new (require(scriptPath))(...constructorArgs);
      return instance;
    } catch (e) {
      console.error(e);
      return null;
    }
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

  destroy() {
    this._id = null;
    this._tempo = null;
    this._devices = null;
    this._hasStart = null;
    this._hasLeadInFrame = null;
    this._hasFrame = null;
    this._hasLeadOutFrame = null;
    this._hasBeat = null;
    this._hasInput = null;
    this._hash = null;
  }
}
