const __easeInQuad = require('eases/quad-in');

/**
 * @function easeInQuad
 * @description Generates a quad easing at start of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInQuad(progress) {
  return __easeInQuad(progress);
};
