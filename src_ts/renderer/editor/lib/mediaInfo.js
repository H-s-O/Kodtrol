import { Howl } from 'howler';

export default (filePath) => new Promise((resolve, reject) => {
  const h = new Howl({
    src: filePath,
    preload: 'metadata',
    html5: true,
    onload: () => {
      const duration = h.duration() * 1000;
      resolve({ duration })
      h.unload();
    },
    onloaderror: (id, err) => {
      reject(err);
      h.unload();
    }
  });
});
