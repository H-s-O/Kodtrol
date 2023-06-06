const __easeOutQuad = require('eases/quad-out');

/**
 * @function easeOutQuad
 * @description Generates a quad easing at end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeOutQuad(progress) {
  return __easeOutQuad(progress);
};
