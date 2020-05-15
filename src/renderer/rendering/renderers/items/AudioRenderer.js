import uniqid from 'uniqid';

export default class AudioRenderer {
  _media = null;
  _providers = null;

  _started = false;
  _volume = 1;
  _streamId = null;
  _duration = 0;
  _id = null;

  constructor(providers, sourceAudio) {
    this._providers = providers;

    const {
      id,
      volume,
      inTime,
      outTime,
      media,
    } = sourceAudio;

    this._id = id;
    this._volume = Number(volume);
    this._duration = Number(outTime) - Number(inTime);

    this._setMedia(media);
  }

  _setMedia(mediaId) {
    this._media = this._providers.getMedia(mediaId);
  }

  reset() {
    this._started = false;
    this._streamId = null;
  }

  render(delta, blockInfo) {
    const { mediaPercent } = blockInfo;
    if (!this._started) {
      this._streamId = uniqid();
    }

    this._started = true;

    const position = mediaPercent * this._duration;
    const volume = this._volume;

    this._media.setActive(true);
    this._media.setVolume(volume);
    this._media.setPosition(position);
    this._media.setStreamId(this._streamId); // hack
  }

  stop() {
    this.reset();
    this._media.stop();
  }
}
