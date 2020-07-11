/**
 * @function clamp
 * @param {Number} value The number to clamp
 * @param {Number} min The minimum value possible
 * @param {Number} max The maximum value possible
 * @returns {Number} If `value` is smaller than `min`, return `min`.
 * If `value` is greater than `max`, return `max`.
 * Otherwise, returns `value`.
 * @example
 * isEven(1)
 * // Returns true
 *
 * isEven(2)
 * // Returns false
 */
export default function clamp(value, min, max) {
  return (value < min ? min : value > max ? max : value);
};
