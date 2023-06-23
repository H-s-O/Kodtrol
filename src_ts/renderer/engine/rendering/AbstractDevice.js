export default class AbstractDevice {
  _id = null;
  _name = null;
  _tags = [];
  _type = null;
  _output = null;
  _providers = null;
  _hash = null;

  constructor(providers) {
    this._providers = providers;
  }

  update(sourceDevice) {
    const {
      id,
      name,
      tags,
      type,
      output,
      hash,
    } = sourceDevice;

    this._id = id;
    this._name = name;
    this._type = type;
    this._hash = hash;
    this._tags = tags;

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

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get hash() {
    return this._hash;
  }

  isType(type) {
    return this._type === type;
  }

  hasTag(tag) {
    return this._tags.includes(tag);
  }

  destroy() {
    this._id = null;
    this._name = null;
    this._tags = null;
    this._type = null;
    this._output = null;
    this._providers = null;
    this._hash = null;
  }
};
