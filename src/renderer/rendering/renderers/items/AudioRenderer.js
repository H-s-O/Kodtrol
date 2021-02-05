export default class AudioRenderer {
  _media = null;
  _providers = null;
  _started = false;
  _volume = 1;
  _duration = 0;

  constructor(providers, sourceAudio) {
    this._providers = providers;

    const {
      volume,
      inTime,
      outTime,
      media,
    } = sourceAudio;

    this._volume = Number(volume);
    this._duration = Number(outTime) - Number(inTime);

    this._setMedia(media);
  }

  _setMedia(mediaId) {
    this._media = this._providers.getMedia(mediaId);
  }

  reset() {
    this._started = false;
  }

  render(delta, blockInfo) {
    const { mediaPercent } = blockInfo;

    if (this._media) {
      this._media.setPlaying(true);

      const position = mediaPercent * this._duration;
      const volume = this._volume;

      this._media.setVolume(volume);
      this._media.setPosition(position, !this._started);
    }

    this._started = true;
  }

  stop() {
    this.reset();

    if (this._media) {
      this._media.setPlaying(false);
    }
  }

  _destroyMediaProxy() {
    if (this._media) {
      this._media.destroy();
    }
  }

  destroy() {
    this._destroyMediaProxy();

    this._media = null;
    this._providers = null;
    this._started = null;
    this._volume = null;
    this._duration = null;
  }
}
