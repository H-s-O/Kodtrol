/**
 * @function isOdd
 * @param {Number} value The number to check
 * @returns {Boolean} Returns `true` if `value` is odd, `false` otherwise.
 * @example
 * isEven(1)
 * // Returns true
 * 
 * isEven(2)
 * // Returns false
 */
export default function isOdd(value) {
  return value % 2 !== 0;
};
