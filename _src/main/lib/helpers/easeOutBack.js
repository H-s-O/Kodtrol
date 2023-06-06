const __easeOutBack = require('eases/back-out');

/**
 * @function easeOutBack
 * @description Generates a "back overshoot" easing at end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeOutBack(progress) {
  return __easeOutBack(progress);
};
