const __easeOutCirc = require('eases/circ-out');

/**
 * @function easeOutCirc
 * @description Generates a circular easing at end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeOutCirc(progress) {
  return __easeOutCirc(progress);
};
