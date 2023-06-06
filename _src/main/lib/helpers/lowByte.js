/**
 * @function lowByte
 * @description Extracts the value of the lower byte of a 16-bit value. Useful for getting the "fine" value of a 16-bit DMX parameter.
 * @param {Number} value The input value
 * @returns {Number} The lower byte value of the input value
 */
export default function lowByte(value) {
  return value & 0xFF;
};
