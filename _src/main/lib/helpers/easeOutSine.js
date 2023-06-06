const __easeOutSine = require('eases/sine-out');

/**
 * @function easeOutSine
 * @description Generates a sine easing at end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeOutSine(progress) {
  return __easeOutSine(progress);
};
