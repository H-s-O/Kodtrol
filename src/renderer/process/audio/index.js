import { Howl } from 'howler';
import { ipcRenderer } from 'electron';

const instances = {};

ipcRenderer.on('data', (e, data) => {
  const dataObj = JSON.parse(data);
  
  for (let streamId in instances) {
    if (!dataObj || !(streamId in dataObj)) {
      instances[streamId].unload();
      delete instances[streamId];
    }
  }
  
  if (dataObj) {
    for (let streamId in dataObj) {
      const { active, position, volume, file } = dataObj[streamId];
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
});
