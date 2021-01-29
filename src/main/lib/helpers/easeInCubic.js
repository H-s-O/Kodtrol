const __easeInCubic = require('eases/cubic-in');

/**
 * @function easeInCubic
 * @description Generates a cubic easing at start of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInCubic(progress) {
  return __easeInCubic(progress);
};
