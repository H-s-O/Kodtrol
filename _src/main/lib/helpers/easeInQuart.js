const __easeInQuart = require('eases/quart-in');

/**
 * @function easeInQuart
 * @description Generates a quart easing at start of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInQuart(progress) {
  return __easeInQuart(progress);
};
