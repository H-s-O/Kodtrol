const __easeInElastic = require('eases/elastic-in');

/**
 * @function easeInElastic
 * @description Generates a "elastic" easing at start of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInElastic(progress) {
  return __easeInElastic(progress);
};
