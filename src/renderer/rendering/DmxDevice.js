import { camelCase, upperFirst } from 'lodash';

import AbstractDevice from './AbstractDevice';

export default class DmxDevice extends AbstractDevice {
  _startingChannel = null;
  _channelAliases = {};
  _channelDefaults = {};
  _channels = {};

  constructor(providers, sourceDevice) {
    super(providers, sourceDevice);

    this.update(sourceDevice);
  }
  
  update = (sourceDevice) => {
    const {
      startChannel,
      channels,
    } = sourceDevice;

    this._startingChannel = parseInt(startChannel);
    
    this._setChannelAliases(channels);
    this._setDefaultValues(channels);
    this._setChannelGettersAndSetters(channels);
  }
  
  _setChannelAliases = (channels) => {
    // Guard
    if (!channels) {
      this._channelAliases = {};
      return;
    }

    this._channelAliases = channels.reduce((obj, {alias}, index) => {
      if (alias) {
        return {
          ...obj,
          [alias]: index,
        };
      }
      return obj;
    }, {});
  }
  
  _setDefaultValues = (channels) => {
    // Guard
    if (!channels) {
      this._channelDefaults = [];
      return;
    }

    this._channelDefaults = channels.map(({defaultValue}) => parseInt(defaultValue));
  }
  
  _setChannelGettersAndSetters = (channels) => {
    if (channels) {
      channels.forEach(({alias}) => {
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

  get startingChannel() {
    return this._startingChannel;
  }

  get channelDefaults() {
    return this._channelDefaults;
  }
  
  get channelAliases() {
    return this._channelAliases;
  }

  get channels() {
    return this._channels;
  }
  
  reset = () => {
    this._channels = {
      ...this._channelDefaults,
    };
  }
  
  sendDataToOutput = () => {
    // Guard
    if (this._output) {
      const data = Object.entries(this._channels).reduce((obj, [channel, channelValue]) => {
        return {
          ...obj,
          [this._startingChannel + Number(channel)]: channelValue,
        };
      }, {});
      this._output.buffer(data);
    }
  }
  
  getChannelDefault = (channel) => {
    if (typeof channel === 'string') {
      channel = this._channelAliases[channel];
    }
    return this._channelDefaults[channel] || 0;
  }

  getChannel = (channel) => {
    if (typeof channel === 'string') {
      channel = this._channelAliases[channel];
    }
    return this._channels[channel] || 0;
  }

  setChannel = (channel, value) => {
    if (typeof channel === 'string') {
      channel = this._channelAliases[channel];
    }
    this._channels[channel] = value;
    return value;
  }

  updateChannel = (channel, func) => {
    return this.setChannel(channel, func(this.getChannel(channel)));
  }
  
  destroy = () => {
    this._startingChannel = null;
    this._channelAliases = null;
    this._channelDefaults = null;
    this._channels = null;

    // super.destroy(); // @TODO needs babel update
  }
};
