import { camelCase, upperFirst } from 'lodash';

import AbstractDevice from './AbstractDevice';

export default class DmxDevice extends AbstractDevice {
  _address = null;
  _channelAliases = {};
  _channelDefaults = {};
  _channelTestValues = {};
  _channels = {};

  constructor(providers, sourceDevice) {
    super(providers);

    this.update(sourceDevice);
  }

  update(sourceDevice) {
    super.update(sourceDevice);

    const {
      address,
      channels,
    } = sourceDevice;

    this._address = parseInt(address);

    this._setChannelAliases(channels);
    this._setDefaultValues(channels);
    this._setTestValues(channels);
    this._setChannelGettersAndSetters(channels);
  }

  _setChannelAliases(channels) {
    // Guard
    if (!channels) {
      this._channelAliases = {};
      return;
    }

    this._channelAliases = channels.reduce((obj, { alias }, index) => {
      if (alias) {
        return {
          ...obj,
          [alias]: index + 1,
        };
      }
      return obj;
    }, {});
  }

  _setDefaultValues(channels) {
    // Guard
    if (!channels) {
      this._channelDefaults = [];
      return;
    }

    this._channelDefaults = channels.map(({ defaultValue }) => defaultValue || 0);
  }

  _setTestValues(channels) {
    // Guard
    if (!channels) {
      this._channelTestValues = [];
      return;
    }

    this._channelTestValues = channels.map(({ testValue }) => testValue || 0);
  }

  _setChannelGettersAndSetters(channels) {
    if (channels) {
      channels.forEach(({ alias }) => {
        if (alias) {
          const aliasMethodName = upperFirst(camelCase(alias));
          this[`get${aliasMethodName}`] = () => {
            return this.getChannel(alias);
          };
          this[`set${aliasMethodName}`] = (value) => {
            this.setChannel(alias, value);
            return this;
          };
        }
      });
    }
  }

  get address() {
    return this._address;
  }

  get channelDefaults() {
    return this._channelDefaults;
  }

  get channelTestValues() {
    return this._channelTestValues;
  }

  get channelAliases() {
    return this._channelAliases;
  }

  get channels() {
    return this._channels;
  }

  reset() {
    this._channels = {
      ...this._channelDefaults,
    };
  }

  applyTestValues() {
    this._channels = {
      ...this._channelTestValues,
    };
  }

  sendDataToOutput() {
    // Guard
    if (this._output) {
      const data = Object.entries(this._channels).reduce((obj, [channel, channelValue]) => {
        return {
          ...obj,
          [this._address + parseInt(channel)]: channelValue,
        };
      }, {});
      this._output.buffer(data);
    }
  }

  getChannelDefault(channel) {
    if (typeof channel === 'string') {
      channel = this._channelAliases[channel];
    }
    return this._channelDefaults[channel - 1] || 0;
  }

  getChannel(channel) {
    if (typeof channel === 'string') {
      channel = this._channelAliases[channel];
    }
    return this._channels[channel - 1] || 0;
  }

  setChannel(channel, value) {
    if (typeof channel === 'string') {
      channel = this._channelAliases[channel];
    }
    this._channels[channel - 1] = value;
    return value;
  }

  updateChannel(channel, func) {
    return this.setChannel(channel, func(this.getChannel(channel)));
  }

  destroy() {
    this._address = null;
    this._channelAliases = null;
    this._channelDefaults = null;
    this._channelTestValues = null;
    this._channels = null;

    super.destroy();
  }
};
