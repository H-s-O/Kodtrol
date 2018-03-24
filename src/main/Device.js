module.exports = class Device {
  constructor(type, startingChannel, numChannels, initChannels = null, vars = {}) {
    this._type = type;
    this._startingChannel = startingChannel;
    this._numChannels = numChannels;
    this._vars = vars;

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
    return this._channels[channel] || 0;
  }

  setChannel(channel, value) {
    this._channels[channel] = value;
  }

  updateChannel(channel, func) {
    return this.setChannel(channel, func(this.getChannel(channel)));
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
