const __easeInQuint = require('eases/quint-in');

/**
 * @function easeInQuint
 * @description Generates a quint easing at start of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInQuint(progress) {
  return __easeInQuint(progress);
};
