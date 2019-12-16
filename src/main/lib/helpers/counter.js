let __counter = {};
export default function counter(id = '__default') {
    if (typeof __counter[id] === 'undefined') {
        __counter[id] = 0;
    }
    return __counter[id]++;
}
export function counterReset(id = '__default') {
    __counter[id] = 0;
}
export function counterResetAll() {
    __counter = {};
}