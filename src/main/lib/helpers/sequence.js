let __sequence = {};
export default function sequence(arr, id = '__default') {
  if (!arr || arr.length === 0) {
    return null;
  }
  if (typeof __sequence[id] === 'undefined' || __sequence[id] >= arr.length) {
    __sequence[id] = 0;
  }
  return arr[__sequence[id]++];
}
export function sequenceReset(id = '__default') {
  __sequence[id] = 0;
}
