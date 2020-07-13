const __easeInOutCubic = require('eases/cubic-in-out');

/**
 * @function easeInOutCubic
 * @description Generates a cubic easing at both start and end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInOutCubic(progress) {
  return __easeInOutCubic(progress);
};
