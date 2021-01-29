/**
 * @function highByte
 * @description Extracts the value of the higher byte of a 16-bit value. Useful for getting the "coarse" value of a 16-bit DMX parameter.
 * @param {Number} value The input value
 * @returns {Number} The higher byte value of the input value
 */
export default function highByte(value) {
  return (value >> 8) & 0xFF;
};
