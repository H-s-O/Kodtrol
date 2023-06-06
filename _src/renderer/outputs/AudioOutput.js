import { Howl } from 'howler';

import AbstractOutput from './AbstractOutput';

export default class AudioOutput extends AbstractOutput {
  _instances = null;
  _streams = null;

  constructor(driver) { // @TODO
    super();

    this._instances = {};
    this._streams = {};

    this._setStatusConnected();

    console.log('Audio output', driver);
  }

  send(dataObj) {
    if ('media' in dataObj) {
      this._handleMedia(dataObj.media);
    } else {
      this._handleRender(dataObj);
    }
    this._setSent();
  }

  _handleMedia(dataObj) {
    // console.log('handleMedia', dataObj);

    try {
      for (let mediaId in this._instances) {
        if (!dataObj || !(mediaId in dataObj) || this._instances[mediaId]._src[0] !== dataObj[mediaId]) {
          this._instances[mediaId].unload();
          delete this._instances[mediaId];

          for (let streamId in this._streams) {
            if (this._streams[streamId].media === mediaId) {
              delete this._streams[streamId];
            }
          }
        }
      }

      for (let mediaId in dataObj) {
        const file = dataObj[mediaId];
        // Guard
        if (!file) {
          continue;
        }

        if (!(mediaId in this._instances)) {
          this._instances[mediaId] = new Howl({
            src: `file://${file}`,
            preload: true,
            html5: true, // As per Howler's docs, does not require loading the entire file before playing
          });
        }
      }
    } catch (err) {
      console.error('AudioOutput _handleMedia error', err);
    }
  }

  _handleRender(dataObj) {
    // console.log('handleRender', dataObj);

    try {
      for (let streamId in this._streams) {
        if (!dataObj || !(streamId in dataObj)) {
          this._instances[this._streams[streamId].media].stop(this._streams[streamId].id);
          delete this._streams[streamId];
        }
      }

      if (dataObj) {
        for (let streamId in dataObj) {
          const { playing, position, volume, media, force } = dataObj[streamId];
          // Guard
          if (!media) {
            continue;
          }

          let stream;
          if (!(streamId in this._streams)) {
            const id = this._instances[media].play();
            this._instances[media].pause(id);
            stream = this._streams[streamId] = { media, id };
          } else {
            stream = this._streams[streamId];
          }

          const instance = this._instances[media];
          const id = stream.id;
          if ((playing && !instance.playing(id)) || force) {
            instance.play(id);
            instance.volume(volume, id);
            instance.seek(position / 1000, id);
          } else if ((!playing && instance.playing(id))) {
            instance.pause(id);
          }
        }
      }
    } catch (err) {
      console.error('AudioOutput _handleRender error', err);
    }
  }

  _refreshStatus() {
    if (this._sent) {
      // Reset flag
      this._resetSent();
      this._setStatusActivity();
      return;
    }

    this._setStatusConnected();
  }

  destroy() {
    // @TODO

    super.destroy();
  }
}
