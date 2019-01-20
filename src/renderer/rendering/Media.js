export default class Media {
  _id = null;
  _file = null;
  _volume = 1;
  _position = 0;
  _speed = 1;
  _streamId = null;
  
  constructor(sourceMedia) {
    this.update(sourceMedia);
  }
  
  update = (sourceMedia) => {
    const {
      id,
      file,
    } = sourceMedia;
    
    this._id = id;
    this._file = file;
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
    return {
      id: this._id,
      volume: this._volume,
      position: this._position,
      speed: this._speed,
    };
  }
  
  resetOutputData = () => {
    this._streamId = null;
    this._position = 0;
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
}