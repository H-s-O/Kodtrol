import { Howl } from 'howler';
import { ipcRenderer } from 'electron';

const instances = {};
const streams = {};

const handleMedia = (dataObj) => {
  // console.log('handleMedia', dataObj);

  try {
    for (let mediaId in instances) {
      if (!dataObj || !(mediaId in dataObj) || instances[mediaId]._src[0] !== dataObj[mediaId]) {
        instances[mediaId].unload();
        delete instances[mediaId];

        for (let streamId in streams) {
          if (streams[streamId].media === mediaId) {
            delete streams[streamId];
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

      if (!(mediaId in instances)) {
        instances[mediaId] = new Howl({
          src: `file://${file}`,
          html5: true, // As per Howler's docs, does not require loading the entire file before playing
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

const handleRender = (dataObj) => {
  // console.log('handleRender', dataObj);

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
          const id = instances[media].play();
          instances[media].pause(id);
          stream = streams[streamId] = { media, id };
        } else {
          stream = streams[streamId];
        }

        const instance = instances[media];
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
    console.error(err);
  }
}

ipcRenderer.on('data', (e, dataObj) => {
  try {
    if ('media' in dataObj) {
      handleMedia(dataObj.media);
    } else {
      handleRender(dataObj);
    }
  } catch (err) {
    console.error(err);
  }
});
