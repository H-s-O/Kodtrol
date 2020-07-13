const __easeOutElastic = require('eases/elastic-out');

/**
 * @function easeOutElastic
 * @description Generates a "elastic" easing at end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeOutElastic(progress) {
  return __easeOutElastic(progress);
};
