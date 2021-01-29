const __easeInOutQuart = require('eases/quart-in-out');

/**
 * @function easeInOutQuart
 * @description Generates a quart easing at both start and end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInOutQuart(progress) {
  return __easeInOutQuart(progress);
};
