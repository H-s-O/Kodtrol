/**
 * @function clamp
 * @description Ensures that an input value is within the range of minimum and maximum values.
 * @param {Number} value The number to clamp
 * @param {Number} min The minimum value possible
 * @param {Number} max The maximum value possible
 * @returns {Number} If `value` is smaller than `min`, return `min`.
 * If `value` is greater than `max`, return `max`.
 * Otherwise, returns `value`.
 * @example
 * clamp(1, 2, 6)
 * // Returns 2
 *
 * clamp(10, 2, 6)
 * // Returns 6
 * 
 * clamp(-42, -100, 0)
 * // Return -42
 */
export default function clamp(value, min, max) {
  return (value < min ? min : value > max ? max : value);
};
