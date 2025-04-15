/**
 * @function randomIndexWhere
 * @param {Array} arr 
 * @param {Function} predicate 
 * @returns {Number|null}
 */
export default function randomIndexWhere(arr, predicate) {
    if (!arr || arr.length === 0 || !predicate) {
        return null;
    }
    let index;
    let start = Date.now();
    do {
        if (Date.now() - start > 100) throw new Error('Possible infinite loop in randomIndexWhere() predicate function');
        index = (Math.floor(Math.random() * arr.length));
    } while (!predicate(index));
    return index;
}
