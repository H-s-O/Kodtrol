module.exports = class Device {
  constructor(type, startingChannel, numChannels, channelAliases = null, initChannels = null, vars = {}) {
    this._type = type;
    this._startingChannel = startingChannel;
    this._numChannels = numChannels;
    this._vars = vars;
    this._channelAliases = channelAliases;

    if (initChannels) {
      this._channels = initChannels;
    } else {
      this._channels = {}
      for (let i = 1; i < this._numChannels + 1; i++) {
        this._channels[i] = 0;
      }
    }
  }

  get startingChannel() {
    return this._startingChannel;
  }

  get numChannels() {
    return this._numChannels;
  }

  get type() {
    return this._type;
  }

  get data() {
    return this._channels;
  }

  is(type) {
    return this.type === type;
  }

  getChannel(channel) {
    if (typeof channel === 'string') {
      channel = this._channelAliases[channel];
    }
    return this._channels[channel] || 0;
  }

  setChannel(channel, value) {
    if (typeof channel === 'string') {
      channel = this._channelAliases[channel];
    }
    this._channels[channel] = value;
  }

  updateChannel(channel, func) {
    return this.setChannel(channel, func(this.getChannel(channel)));
  }

  varIsSet(name) {
    return name in this._vars;
  }

  getVar(name) {
    return this._vars[name] || 0;
  }

  setVar(name, value) {
    this._vars[name] = value;
    return value;
  }

  updateVar(name, func) {
    return this.setVar(name, func(this.getVar(name)));
  }
};
