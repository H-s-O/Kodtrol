import MidiInput from '../inputs/MidiInput';
import OscInput from '../inputs/OscInput';

export default class Input {
  _id = null;
  _status = 0;
  _type = null;
  _extraData = null;
  _input = null;
  _onInputCallback = null;
  _hash = null;
  
  constructor(sourceInput, onInputCallback) {
    this.update(sourceInput, onInputCallback);
  }
  
  update = (sourceInput, onInputCallback) => {
    const {
      id,
      type,
      extraData,
      hash,
    } = sourceInput;
    
    this._id = id;
    this._type = type;
    this._extraData = extraData;
    this._onInputCallback = onInputCallback;
    this._hash = hash;
    
    this.setInput(type, extraData);
  }
  
  setInput = (type, extraData) => {
    if (this._input) {
      this._input.destroy();
    }
    
    let input = null;
    
    if (type === 'midi') {
      input = new MidiInput(this.inputMessageCallback);
    } else if (type === 'osc') {
      const { port } = extraData;
      input = new OscInput(this.inputMessageCallback, port);
    }

    this._input = input;
  }
  
  get id() {
    return this._id;
  }
  
  get status() {
    return this._status;
  }
  
  get type() {
    return this._type;
  }
  
  get hash() {
    return this._hash;
  }
  
  inputMessageCallback = (message) => {
    if (this._onInputCallback) {
      this._onInputCallback(this._type, message);
    }
  }
  
  destroy = () => {
    if (this._input) {
      this._input.destroy();
    }

    this._id = null;
    this._status = null;
    this._type = null;
    this._extraData = null;
    this._input = null;
    this._onInputCallback = null;
    this._hash = null;
  }
}