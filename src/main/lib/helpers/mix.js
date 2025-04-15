/**
 * @function mix
 * @param {Number} a 
 * @param {Number} b 
 * @param {Number} percent
 * @returns {Number}
 */
export default function mix(a, b, percent = 0.5, type = 'linear') {
    return a + ((b - a) * percent);
}
