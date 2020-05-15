import { camelCase, upperFirst } from 'lodash';

import AbstractDeviceProxy from './AbstractDeviceProxy';

export default class DmxDeviceProxy extends AbstractDeviceProxy {
  constructor(originDevice) {
    super(originDevice);

    this._setChannelVarHelpers(this._proxyTarget.channelAliases);
  }

  _setChannelVarHelpers(channels) {
    Object.keys(channels).forEach((alias) => {
      const aliasMethodName = upperFirst(camelCase(alias));
      this[`set${aliasMethodName}FromVar`] = (varName) => {
        this.setChannelFromVar(alias, varName);
        return this;
      };
    });
  }

  setChannelFromVar(channel, varName = null) {
    return this.setChannel(channel, this.getVar(varName !== null ? varName : channel));
  }
}
