const __easeOutQuart = require('eases/quart-out');

/**
 * @function easeOutQuart
 * @description Generates a quart easing at end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeOutQuart(progress) {
  return __easeOutQuart(progress);
};
