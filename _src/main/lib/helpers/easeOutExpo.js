const __easeOutExpo = require('eases/expo-out');

/**
 * @function easeOutExpo
 * @description Generates a exponential easing at end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeOutExpo(progress) {
  return __easeOutExpo(progress);
};
