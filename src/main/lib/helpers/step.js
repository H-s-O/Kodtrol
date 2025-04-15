/**
 * @function step
 * @param {Number} value 
 * @param {Number} step 
 * @returns {Number}
 */
export default function step(value, step = 1) {
    return (Math.round(value / step) * step);
}
