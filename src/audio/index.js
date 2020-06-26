import { Howl } from 'howler';
import { ipcRenderer } from 'electron';

const instances = {};

ipcRenderer.on('data', (e, data) => {
  try {
    for (let streamId in instances) {
      if (!data || !(streamId in data)) {
        instances[streamId].unload();
        delete instances[streamId];
      }
    }

    if (data) {
      for (let streamId in data) {
        const { active, position, volume, file } = data[streamId];
        // Guard
        if (!file) {
          continue;
        }

        let instance;
        if (!(streamId in instances)) {
          instance = new Howl({
            src: `file://${file}`,
            html5: true, // As per Howler's docs, does not require loading the entire file before playing
          });
          instances[streamId] = instance;
        } else {
          instance = instances[streamId];
        }

        if (active) {
          if (!instance.playing()) {
            instance.play();
            instance.volume(volume);
            instance.seek(position / 1000);
          }
        } else {
          instance.pause();
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
});
