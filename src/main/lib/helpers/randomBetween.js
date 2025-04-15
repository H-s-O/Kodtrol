/**
 * @function randomBetween
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
export default function randomBetween(min, max) {
    return (min + (Math.random() * (max - min)));
}
