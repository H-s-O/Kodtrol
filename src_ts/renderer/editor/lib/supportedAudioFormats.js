import { Howler } from 'howler';

// @see https://github.com/goldfire/howler.js#codecsext
// Note: we comment out video containers formats, which we don't support for now.
const supportedAudioFormats = [
  'mp3',
  // 'mpeg',
  'opus',
  'ogg',
  'oga',
  'wav',
  'aac',
  'caf',
  'm4a',
  'm4b',
  // 'mp4',
  'weba',
  // 'webm',
  'dolby',
  'flac'
].filter((codec) => Howler.codecs(codec));

export default supportedAudioFormats;
