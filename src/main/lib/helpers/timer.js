let __timer = {};
/**
 * @function timer
 * @param {String} id 
 */
export default function timer(id = '__default') {
    if (typeof __timer[id] === 'undefined') {
        __timer[id] = Date.now();
    }
}
/**
 * @function timerValue
 * @param {String} id 
 * @returns {Number}
 */
export function timerValue(id = '__default') {
    if (typeof __timer[id] === 'undefined') {
        return NaN;
    }
    return Date.now() - __timer[id];
}
/**
 * @function timerLimit
 * @param {Number} limit 
 * @param {String} id 
 * @returns {Boolean}
 */
export function timerLimit(limit, id = '__default') {
    if (typeof __timer[id] === 'undefined') {
        __timer[id] = Date.now();
    }
    return (Date.now() - __timer[id]) >= limit;
}
/**
 * @function timerReset
 * @param {String} id 
 */
export function timerReset(id = '__default') {
    __timer[id] = Date.now();
}
/**
 * @function timerResetAll
 */
export function timerResetAll() {
    __timer = {};
}
