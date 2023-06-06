const __easeInCirc = require('eases/circ-in');

/**
 * @function easeInCirc
 * @description Generates a circular easing at start of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInCirc(progress) {
  return __easeInCirc(progress);
};
