const __easeOutQuint = require('eases/quint-out');

/**
 * @function easeOutQuint
 * @description Generates a quint easing at end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeOutQuint(progress) {
  return __easeOutQuint(progress);
};
