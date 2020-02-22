import { remote } from 'electron';

const ffprobe = remote.require('ffprobe');
const ffprobeStatic = remote.require('ffprobe-static');

export default (filePath) => new Promise((resolve, reject) => {
  ffprobe(filePath, { path: ffprobeStatic.path }, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});
