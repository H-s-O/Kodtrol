const __easeInOutBack = require('eases/back-in-out');

/**
 * @function easeInOutBack
 * @description Generates a "back overshoot" easing at both start and end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInOutBack(progress) {
  return __easeInOutBack(progress);
};
