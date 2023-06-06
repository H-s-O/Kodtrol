const __easeInOutElastic = require('eases/elastic-in-out');

/**
 * @function easeInOutElastic
 * @description Generates a "elastic" easing at both start and end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInOutElastic(progress) {
  return __easeInOutElastic(progress);
};
