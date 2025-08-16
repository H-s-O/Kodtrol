/**
 * @function randomBetweenWhere
 * @param {Number} min
 * @param {Number} max
 * @param {Function} predicate
 * @returns {Number|null}
 */
export default function randomBetweenWhere(min, max, predicate) {
  if (!predicate) {
    return null
  }
  let value
  let start = Date.now()
  do {
    if (Date.now() - start > 100) throw new Error("Possible infinite loop in randomBetweenWhere() predicate function")
    value = min + Math.random() * (max - min)
  } while (!predicate(value))
  return value
}
