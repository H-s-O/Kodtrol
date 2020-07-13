const __easeInOutQuad = require('eases/quad-in-out');

/**
 * @function easeInOutQuad
 * @description Generates a quad easing at both start and end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInOutQuad(progress) {
  return __easeInOutQuad(progress);
};
