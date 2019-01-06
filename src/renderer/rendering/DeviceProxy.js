import AbstractProxy from './AbstractProxy';

export default class DeviceProxy extends AbstractProxy {
  _vars = {};
    
  constructor(originDevice) {
    super(originDevice);
  }
  
  get vars() {
    return this._vars;
  }
  
  resetVars = () => {
    this._vars = {};
  }
  
  varIsSet = (name) => {
    return name in this._vars;
  }

  getVar = (name) => {
    return this._vars[name];
  }

  setVar = (name, value) => {
    this._vars[name] = value;
    return value;
  }

  updateVar = (name, func) => {
    return this.setVar(name, func(this.getVar(name)));
  }
  
  setChannelFromVar = (channel, varName) => {
    return this.setChannel(channel, this.getVar(varName));
  }
}