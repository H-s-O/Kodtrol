export default class DeviceProxy {
  _originDevice = null;
  _vars = {};
    
  constructor(originDevice) {
    this._originDevice = originDevice;
    
    this.setProxiedMembers(originDevice);
  }
  
  setProxiedMembers = (originDevice) => {
    for (let prop in originDevice) {
      if (typeof originDevice[prop] === 'function') {
        this[prop] = (...args) => { 
          return Reflect.apply(this._originDevice[prop], this._originDevice, args);
        };
      }
    }
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