import _camelCase from 'lodash/camelCase';
import _upperFirst from 'lodash/upperFirst';

export default class Device {
  _id = null;
  _lastUpdated = null;
  _name = null;
  _type = null;
  _groups = [];
  _startingChannel = null;
  _channelAliases = {};
  _channelDefaults = {};
  _channels = {};
  _output = null;
  _providers = null;
  
  constructor(providers, sourceDevice) {
    this._providers = providers;
    
    this.update(sourceDevice);
  }
  
  update = (sourceDevice) => {
    const {
      id,
      lastUpdated,
      name,
      type,
      groups,
      channels,
      startChannel,
      output,
    } = sourceDevice;

    this._id = id;
    this._lastUpdated = Number(lastUpdated);
    this._name = name;
    this._type = type;
    this._startingChannel = Number(startChannel);
    
    this.setOutput(output);
    this.setGroups(groups);
    this.setChannelAliases(channels);
    this.setDefaultValues(channels);
    this.setChannelGettersAndSetters(channels);
  }
  
  setOutput = (outputId) => {
    this._output = this._providers.getOutput(outputId);
  }
  
  setGroups = (groups) => {
    if (typeof groups === 'string') { // backward compat
      this._groups = groups.split(',');
      return;
    }
    this._groups = groups;
  }
  
  setChannelAliases = (channels) => {
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
  
  setDefaultValues = (channels) => {
    this._channelDefaults = channels.map(({defaultValue}) => Number(defaultValue));
  }
  
  setChannelGettersAndSetters = (channels) => {
    channels.forEach(({alias}) => {
      if (alias) {
        const aliasMethodName = _upperFirst(_camelCase(alias));
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

  get id() {
    return this._id;
  }
  
  get startingChannel() {
    return this._startingChannel;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
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
  
  resetChannels = () => {
    this._channels = {
      ...this._channelDefaults,
    };
  }
  
  sendDataToOutput = () => {
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
  
  is = (type) => {
    return this._type === type;
  }
  
  hasGroup = (group) => {
    return this._groups.indexOf(group) !== -1;
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
};
