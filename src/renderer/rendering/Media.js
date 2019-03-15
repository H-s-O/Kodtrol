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
  
  constructor(providers, sourceMedia) {
    this._providers = providers;
    
    this.update(sourceMedia);
  }
  
  update = (sourceMedia) => {
    const {
      id,
      file,
    } = sourceMedia;
    
    this._id = id;
    this._file = file;
    
    this.setOutput('audio'); // @TODO
  }
  
  setOutput = (outputId) => {
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
  
  get outputData() {
    if (!this._active) {
      return {}
    };
    
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
  
  stop = () => {
    this.resetOutputData();
    this.sendDataToOutput();
  }
  
  resetOutputData = () => {
    this._streamId = null;
    this._position = 0;
    this._active = false;
  }
  
  sendDataToOutput = () => {
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
  
  setStreamId = (streamId) => {
    this._streamId = streamId;
  }
  
  setVolume = (volume) => {
    this._volume = volume;
  }
  
  setPosition = (position) => {
    this._position = position;
  }
  
  setSpeed = (speed) => {
    this._speed = speed;
  }
  
  setActive = (flag) => {
    this._active = flag;
  }
}