import MidiInput from '../inputs/MidiInput';
import OscInput from '../inputs/OscInput';

export default class Input {
  _status = 0;
  _type = null;
  _extraData = null;
  _input = null;
  _onInputCallback = null;
  
  constructor(sourceInput, onInputCallback) {
    this.update(sourceInput, onInputCallback);
  }
  
  update = (sourceInput, onInputCallback) => {
    const {
      type,
      extraData,
    } = sourceInput;
    
    this._type = type;
    this._extraData = extraData;
    this._onInputCallback = onInputCallback;
    
    this.setInput(type, extraData);
  }
  
  setInput = (type, extraData) => {
    let input = null;
    
    if (type === 'midi') {
      input = new MidiInput(this.inputMessageCallback);
    } else if (type === 'osc') {
      const { port } = extraData;
      input = new OscInput(this.inputMessageCallback, port);
    }

    this._input = input;
  }
  
  get status() {
    return this._status;
  }
  
  get type() {
    return this._type;
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
  }
}