const __SimplexNoise = require('simplex-noise');
let __noise = {};
/**
 * @function noise
 * @param {String} id 
 * @param {*} seed 
 * @returns {*}
 */
export default function noise(id = '__default', seed = undefined) {
  if (typeof __noise[id] === 'undefined') {
    __noise[id] = new __SimplexNoise(seed);
  }
  return __noise[id];
}
/**
 * @function noise2d
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} id 
 * @param {*} seed 
 * @returns {Number}
 */
export function noise2d(x, y, id = '__default', seed = undefined) {
  if (typeof __noise[id] === 'undefined') {
    __noise[id] = new __SimplexNoise(seed);
  }
  return __noise[id].noise2D(x, y);
}
/**
 * @function noise3d
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 * @param {String} id 
 * @param {*} seed 
 * @returns {Number}
 */
export function noise3d(x, y, z, id = '__default', seed = undefined) {
  if (typeof __noise[id] === 'undefined') {
    __noise[id] = new __SimplexNoise(seed);
  }
  return __noise[id].noise3D(x, y, z);
}
/**
 * @function noise4d
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 * @param {Number} w 
 * @param {String} id 
 * @param {*} seed 
 * @returns {Number}
 */
export function noise4d(x, y, z, w, id = '__default', seed = undefined) {
  if (typeof __noise[id] === 'undefined') {
    __noise[id] = new __SimplexNoise(seed);
  }
  return __noise[id].noise4D(x, y, z, w);
}
