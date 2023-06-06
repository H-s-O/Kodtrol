const __easeInOutBounce = require('eases/bounce-in-out');

/**
 * @function easeInOutBounce
 * @description Generates a "bouncing" easing at both start and end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInOutBounce(progress) {
  return __easeInOutBounce(progress);
};
