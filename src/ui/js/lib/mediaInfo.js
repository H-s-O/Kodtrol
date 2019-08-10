import { remote } from 'electron';

const ffprobe = remote.require('ffprobe');
const ffprobeStatic = remote.require('ffprobe-static')

export default (filePath, callback) => {
    ffprobe(filePath, { path: ffprobeStatic.path }, callback)
}
