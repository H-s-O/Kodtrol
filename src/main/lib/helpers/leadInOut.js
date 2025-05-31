/**
 * @function normLeadInPercent
 * @param {Number} percent
 * @param {Boolean} invert
 * @returns {Number}
 */
export function normLeadInPercent(percent, invert = false) {
  return invert ? 1 - (percent + 1) : percent + 1;
}
/**
 * @function normLeadOutPercent
 * @param {Number} percent
 * @param {Boolean} invert
 * @returns {Number}
 */
export function normLeadOutPercent(percent, invert = false) {
  return invert ? 1 - (percent - 1) : percent - 1;
}
