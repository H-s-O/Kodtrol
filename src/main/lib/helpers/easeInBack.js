const __easeInBack = require('eases/back-in');

/**
 * @function easeInBack
 * @description Generates a "back overshoot" easing at start of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInBack(progress) {
  return __easeInBack(progress);
};
