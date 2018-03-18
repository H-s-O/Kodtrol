module.exports = class Device {
  constructor(startingChannel, numChannels, initChannels = null, vars = null) {
    this._startingChannel = startingChannel;
    this._numChannels = numChannels;
    this._vars = vars;

    if (initChannels) {
      this._channels = initChannels;
    } else {
      this._channels = {}
      for (let i = 0; i < this._numChannels; i++) {
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

  get data() {
    return this._channels;
  }

  getChannel(channel) {
    return this._channels[channel] || 0;
  }

  setChannel(channel, value) {
    this._channels[channel] = value;
  }

  getVar(name) {
    return this._vars[name] || 0;
  }

  setVar(name, value) {
    this._vars[name] = value;
  }
};
