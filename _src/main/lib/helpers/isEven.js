/**
 * @function isEven
 * @param {Number} value The number to check
 * @returns {Boolean} Returns `true` if `value` is even, `false` otherwise.
 * @example
 * isEven(1)
 * // Returns false
 * 
 * isEven(2)
 * // Returns true
 */
export default function isEven(value) {
  return value % 2 === 0;
};
