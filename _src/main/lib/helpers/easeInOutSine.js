const __easeInOutSine = require('eases/sine-in-out');

/**
 * @function easeInOutSine
 * @description Generates a sine easing at both start and end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInOutSine(progress) {
  return __easeInOutSine(progress);
};
