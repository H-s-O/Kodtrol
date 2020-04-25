
const __SimplexNoise = require('simplex-noise');
let __noise = {};
export default function noise(id = '__default', seed = undefined) {
  if (typeof __noise[id] === 'undefined') {
    __noise[id] = new __SimplexNoise(seed);
  }
  return __noise[id];
}
export function noise2d(x, y, id = '__default', seed = undefined) {
  if (typeof __noise[id] === 'undefined') {
    __noise[id] = new __SimplexNoise(seed);
  }
  return __noise[id].noise2D(x, y);
}
export function noise3d(x, y, z, id = '__default', seed = undefined) {
  if (typeof __noise[id] === 'undefined') {
    __noise[id] = new __SimplexNoise(seed);
  }
  return __noise[id].noise3D(x, y, z);
}
export function noise4d(x, y, z, w, id = '__default', seed = undefined) {
  if (typeof __noise[id] === 'undefined') {
    __noise[id] = new __SimplexNoise(seed);
  }
  return __noise[id].noise4D(x, y, z, w);
}
