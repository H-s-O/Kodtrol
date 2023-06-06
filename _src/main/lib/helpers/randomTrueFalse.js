/**
 * @function randomTrueFalse
 * @param {Number} [bias=0.5] Adjust probability bias; a value closer to `0` will result in more `true`s a value close to `1` will result in more `false`s.
 * @return {Boolean} A random `true` or `false`.
 */
export default function randomTrueFalse(bias = 0.5) {
  return (Math.random() >= bias);
};
