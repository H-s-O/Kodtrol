const __easeInBounce = require('eases/bounce-in');

/**
 * @function easeInBounce
 * @description Generates a "bouncing" easing at start of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInBounce(progress) {
  return __easeInBounce(progress);
};
