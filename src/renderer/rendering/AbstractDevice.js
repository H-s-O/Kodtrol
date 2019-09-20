export default class AbstractDevice {
  _id = null;
  _name = null;
  _groups = [];
  _type = null;
  _output = null;
  _providers = null;
  _hash = null;

  constructor(providers, sourceDevice) {
    this._providers = providers;
    
    this.update(sourceDevice);
  }
  
  update = (sourceDevice) => {
    const {
      id,
      name,
      groups,
      type,
      output,
      hash,
    } = sourceDevice;

    this._id = id;
    this._name = name;
    this._type = type;
    this._hash = hash;
    
    this.setOutput(output);
    this.setGroups(groups);
  }
  
  setOutput = (outputId) => {
    // Guard
    if (!outputId) {
      this._output = null;
      return;
    }
    
    this._output = this._providers.getOutput(outputId);
  }
  
  setGroups = (groups) => {
    if (typeof groups === 'string') { // backward compat
      this._groups = groups.split(',');
      return;
    }
    this._groups = groups;
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
  
  is = (type) => {
    return this._type === type;
  }
  
  hasGroup = (group) => {
    return this._groups.indexOf(group) !== -1;
  }
  
  destroy = () => {
    this._id = null;
    this._name = null;
    this._groups = null;
    this._type = null;
    this._output = null;
    this._providers = null;
    this._hash = null;
  }
};
