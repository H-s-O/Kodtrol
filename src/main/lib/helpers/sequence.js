let __sequence = {};
/**
 * @function sequence
 * @param {Array} arr 
 * @param {String} id 
 * @returns {*}
 */
export default function sequence(arr, id = '__default') {
  if (!arr || arr.length === 0) {
    return null;
  }
  if (typeof __sequence[id] === 'undefined' || __sequence[id] >= arr.length) {
    __sequence[id] = 0;
  }
  return arr[__sequence[id]++];
}
/**
 * @function sequenceIndex
 * @param {String} id 
 * @returns {Number}
 */
export function sequenceIndex(id = '__default') {
  return __sequence[id]
}
/**
 * @function sequenceReset
 * @param {String} id 
 */
export function sequenceReset(id = '__default') {
  __sequence[id] = 0;
}
