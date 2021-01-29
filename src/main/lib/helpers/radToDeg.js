/**
 * @function radToDeg
 * @description Converts a value in radians to a value in degrees.
 * @param {Number} radians The input value in radians
 * @returns {Number} The corresponding value in degrees
 */
export default function radToDeg(radians) {
  return (radians * (180 / Math.PI));
};
