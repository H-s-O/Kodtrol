import uniqid from 'uniqid';

import AbstractProxy from './AbstractProxy';

export default class MediaProxy extends AbstractProxy {
  _streamId = null;
  _volume = 1;
  _position = 0;
  _speed = 1;
  _playing = false;

  constructor(originMedia) {
    super(originMedia);

    this._streamId = uniqid();
  }

  setVolume(volume, force = false) {
    this._volume = volume;
    this._updateStream(force);
  }

  setPosition(position, force = false) {
    this._position = position;
    this._updateStream(force);
  }

  setSpeed(speed, force = false) {
    this._speed = speed;
    this._updateStream(force);
  }

  setPlaying(flag) {
    this._playing = flag;
    this._updateStream();
  }

  _updateStream(force = false) {
    this.setStream(this._streamId, {
      playing: this._playing,
      position: this._position,
      speed: this._speed,
      volume: this._volume,
      force,
    });
  }

  destroy() {
    this._streamId = null;
    this._volume = null;
    this._position = null;
    this._speed = null;
    this._playing = null;

    super.destroy();
  }
}
