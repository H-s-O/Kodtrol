const __easeInOutCirc = require('eases/circ-in-out');

/**
 * @function easeInOutCirc
 * @description Generates a circular easing at both start and end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInOutCirc(progress) {
  return __easeInOutCirc(progress);
};
