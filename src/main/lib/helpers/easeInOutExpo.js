const __easeInOutExpo = require('eases/expo-in-out');

/**
 * @function easeInOutExpo
 * @description Generates a exponential easing at both start and end of period.
 * @param {Number} progress The normalized progress value, from `0` to `1`
 * @returns {Number} An eased, normalized value from `0` to `1`.
 */
export default function easeInOutExpo(progress) {
  return __easeInOutExpo(progress);
};
