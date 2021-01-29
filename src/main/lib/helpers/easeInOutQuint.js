const __easeInOutQuint = require('eases/quint-in-out');

/**
 * @function easeInOutQuint
 * @description Generates a quint easing at both start and end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInOutQuint(progress) {
  return __easeInOutQuint(progress);
};
