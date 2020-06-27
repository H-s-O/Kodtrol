import { Howl } from 'howler';
import { ipcRenderer } from 'electron';

const instances = {};
const streams = {};

const handleMedia = (dataObj) => {
  try {
    for (let mediaId in dataObj) {
      if (mediaId in instances) {
        instances[mediaId].unload();
        delete instances[mediaId];
      }

      const file = dataObj[mediaId];

      // Guard
      if (!file) {
        continue;
      }

      instances[mediaId] = new Howl({
        src: `file://${file}`,
        html5: true, // As per Howler's docs, does not require loading the entire file before playing
      });
    }
  } catch (err) {
    console.error(err);
  }
}

const handleRender = (dataObj) => {
  try {
    for (let streamId in streams) {
      if (!dataObj || !(streamId in dataObj)) {
        instances[streams[streamId].media].stop(streams[streamId].id);
        delete streams[streamId];
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
        if (!(streamId in streams)) {
          stream = streams[streamId] = {
            media,
            id: instances[media].play(),
          };
        } else {
          stream = streams[streamId];
        }

        const instance = instances[media];
        const id = stream.id;

        if (playing) {
          if (!instance.playing(id) || force) {
            instance.play(id);
            instance.volume(volume, id);
            instance.seek(position / 1000, id);
          }
        } else {
          instance.pause(id);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

ipcRenderer.on('data', (e, data) => {
  console.log("index", data);
  try {
    const dataObj = JSON.parse(data);
    if ('media' in dataObj) {
      handleMedia(dataObj.media);
    } else {
      handleRender(dataObj);
    }
  } catch (err) {
    console.error(err);
  }
});
