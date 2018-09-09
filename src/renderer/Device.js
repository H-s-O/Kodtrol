export default class Device {
  _id = null;
  _name = null;
  _type = null;
  _groups = null;
  _startingChannel = null;
  _channelAliases = null;
  _defaultValues = null;
  _vars = {};
  _channels = {};
  
  constructor(sourceDevice) {
    const { id, name, type, groups, channels, startChannel } = sourceDevice;

    this._id = id;
    this._name = name;
    this._type = type;
    this._groups = groups;
    this._startingChannel = Number(startChannel);
    this._channelAliases = channels.reduce((obj, {alias}, index) => {
      if (alias) {
        return {
          ...obj,
          [alias]: index,
        };
      }
      return obj;
    }, {});
    this._defaultValues = channels.map(({defaultValue}) => Number(defaultValue));
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

  get data() {
    return this._channels;
  }

  reset = (resetVars = true) => {
    this._channels = {};
    if (resetVars) {
      this._vars = {};
    }
  }

  is = (type) => {
    return this._type === type;
  }
  
  hasGroup = (group) => {
    return this._groups === group;
  }
  
  getChannelDefault = (channel) => {
    if (typeof channel === 'string') {
      channel = this._channelAliases[channel];
    }
    return this._defaultValues[channel] || 0;
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
  
  setChannelFromVar = (channel, varName) => {
    return this.setChannel(channel, this.getVar(varName));
  }

  updateChannel = (channel, func) => {
    return this.setChannel(channel, func(this.getChannel(channel)));
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
};
