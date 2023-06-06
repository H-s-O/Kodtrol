const __easeInSine = require('eases/sine-in');

/**
 * @function easeInSine
 * @description Generates a sine easing at start of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInSine(progress) {
  return __easeInSine(progress);
};
