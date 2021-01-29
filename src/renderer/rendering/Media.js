export default class Media {
  _providers = null;
  _id = null;
  _file = null;
  _duration = 0;
  _output = null;
  _hash = null;
  _streams = {};

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

  get file() {
    return this._file;
  }

  get duration() {
    return this._duration;
  }

  get hash() {
    return this._hash;
  }

  get output() {
    return this._output;
  }

  reset() {
    this._streams = {};
  }

  sendDataToOutput() {
    if (this._output) {
      this._output.buffer(this._streams);
    }
  }

  setStream(streamId, info) {
    this._streams[streamId] = {
      ...info,
      media: this._id,
    };
  }

  destroy() {
    this._providers = null;
    this._id = null;
    this._file = null;
    this._duration = null;
    this._output = null;
    this._hash = null;
    this._streams = null;
  }
}
