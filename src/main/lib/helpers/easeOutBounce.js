const __easeOutBounce = require('eases/bounce-out');

/**
 * @function easeOutBounce
 * @description Generates a "bouncing" easing at end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeOutBounce(progress) {
  return __easeOutBounce(progress);
};
