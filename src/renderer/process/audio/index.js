import { Howl } from 'howler';
import { ipcRenderer } from 'electron';

const instances = {};

ipcRenderer.on('data', (e, data) => {
  const dataObj = JSON.parse(data);
  
  for (let streamId in instances) {
    if (!dataObj || !(streamId in dataObj)) {
      // console.log('unload', streamId);
      
      instances[streamId].unload();
      delete instances[streamId];
    }
  }
  
  if (dataObj) {
    for (let streamId in dataObj) {
      const { position, volume, file } = dataObj[streamId];
      if (!(streamId in instances)) {
        const instance = new Howl({
          src: `file://${file}`,
          html5: true, // As per Howler's docs, does not require loading the entire file before playing
        });
        instance.play();
        instance.volume(volume);
        instance.seek(position / 1000);
        
        instances[streamId] = instance;
      }
    }
  }
});
