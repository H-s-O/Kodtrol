/**
 * @function rgbColor
 * @description Creates a color object with keys containing the values of RGB color components.
 * @param {Number} [r=0] The red value
 * @param {Number} [g=0] The green value
 * @param {Number} [b=0] The blue value
 * @returns {Object} An object containing the matching `r`, `g`, and `b` keys from the parameters.
 */
export default function rgbColor(r = 0, g = 0, b = 0) {
  return { r, g, b };
}; 
