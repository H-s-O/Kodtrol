export default class Media {
  _id = null;
  _file = null;
  _volume = 1;
  _position = 0;
  _speed = 1;
  _streamId = null;
  _active = false;
  _output = null;
  _providers = null;
  _hash = null;
  _duration = 0;

  constructor(providers, sourceMedia) {
    this._providers = providers;

    this.update(sourceMedia);
  }

  update(sourceMedia) {
    const {
      id,
      file,
      output,
      hash,
      duration,
    } = sourceMedia;

    this._id = id;
    this._file = file;
    this._hash = hash;
    this._duration = duration;

    this._setOutput(output);
  }

  _setOutput(outputId) {
    // Guard
    if (!outputId) {
      this._output = null;
      return;
    }

    this._output = this._providers.getOutput(outputId);
  }

  get id() {
    return this._id;
  }

  get streamId() {
    return this._streamId;
  }

  get file() {
    return this._file;
  }

  get duration() {
    return this._duration;
  }

  get outputData() {
    if (!this._active) {
      return {};
    }

    return {
      id: this._id,
      volume: this._volume,
      position: this._position,
      speed: this._speed,
      file: this._file,
    };
  }

  get active() {
    return this._active;
  }

  get hash() {
    return this._hash;
  }

  stop() {
    this.reset();
    this.sendDataToOutput();
  }

  reset() {
    this._streamId = null;
    this._position = 0;
    this._active = false;
  }

  sendDataToOutput() {
    if (this._output) {
      const data = {
        [this._streamId]: this._active ? {
          active: true,
          volume: this._volume,
          position: this._position,
          speed: this._speed,
          file: this._file,
        } : {
            active: false,
          },
      };

      this._output.buffer(data);
    }
  }

  setStreamId(streamId) {
    this._streamId = streamId;
  }

  setVolume(volume) {
    this._volume = volume;
  }

  setPosition(position) {
    this._position = position;
  }

  setSpeed(speed) {
    this._speed = speed;
  }

  setActive(flag) {
    this._active = flag;
  }

  destroy() {
    this._id = null;
    this._file = null;
    this._volume = null;
    this._position = null;
    this._speed = null;
    this._streamId = null;
    this._active = null;
    this._output = null;
    this._providers = null;
    this._hash = null;
    this._duration = null;
  }
}
