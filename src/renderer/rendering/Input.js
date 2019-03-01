export default class Input {
  _status = 0;
  _type = null;
  _extraData = null;
  _input = null;
  
  constructor(sourceInput) {
    this.update(sourceInput);
  }
  
  update = (sourceInput) => {
    const {
      type,
      extraData,
    } = sourceInput;
    
    this._type = type;
    this._extraData = extraData;
  }
  
  get status() {
    return this._status;
  }
  
  get type() {
    return this._type;
  }
  
  destroy = () => {
    if (this._input) {
      this._input.destroy();
    }
  }
}