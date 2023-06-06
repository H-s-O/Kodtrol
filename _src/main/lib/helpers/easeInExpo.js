const __easeInExpo = require('eases/expo-in');

/**
 * @function easeInExpo
 * @description Generates a exponential easing at start of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInExpo(progress) {
  return __easeInExpo(progress);
};
