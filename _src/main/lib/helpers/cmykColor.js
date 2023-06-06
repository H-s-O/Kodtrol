/**
 * @function cmykColor
 * @description Creates an object with keys containing the values of CMYK color components.
 * @param {Number} [c=0] The cyan value
 * @param {Number} [m=0] The magenta value
 * @param {Number} [y=0] The yellow value
 * @param {Number} [k=0] The black value
 * @returns {Object} An object containing the matching `c`, `m`, `y` and `k` keys from the parameters.
 */
export default function cmykColor(c = 0, m = 0, y = 0, k = 0) {
  return { c, m, y, k };
}; 
