import { Howl, Howler } from 'howler';
import { ipcRenderer } from 'electron';

Howler.usingWebAudio = true;

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
      const { id, position } = dataObj[streamId];
      if (!(streamId in instances)) {
        // console.log('create', id, position);
        
        const instance = new Howl({
          src: `http://localhost:5555/current-timeline/blocks/${id}/file`,
          html5: true,
        });
        instance.play();
        instance.seek(position / 1000);
        
        instances[streamId] = instance;
      }
    }
  }
});
