import _camelCase from 'lodash/camelCase';
import _upperFirst from 'lodash/upperFirst';

import AbstractProxy from './AbstractProxy';

export default class DeviceProxy extends AbstractProxy {
  _vars = {};
    
  constructor(originDevice) {
    super(originDevice);
    
    this.setChannelVarHelpers(this._proxyTarget.channelAliases);
  }
  
  setChannelVarHelpers = (channels) => {
    Object.keys(channels).forEach((alias) => {
      const aliasMethodName = _upperFirst(_camelCase(alias));
      this[`set${aliasMethodName}FromVar`] = (varName) => {
        this.setChannelFromVar(alias, varName);
        return this;
      };
    });
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
  
  destroy = () => {
    this._vars = null;
    
    super.destroy();
  }
}