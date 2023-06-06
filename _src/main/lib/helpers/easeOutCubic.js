const __easeOutCubic = require('eases/cubic-out');

/**
 * @function easeOutCubic
 * @description Generates a cubic easing at end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeOutCubic(progress) {
  return __easeOutCubic(progress);
};
