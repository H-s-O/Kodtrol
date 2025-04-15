/**
 * @function randomValueWhere
 * @param {Array} arr 
 * @param {Function} predicate 
 * @returns {*|null}
 */
export default function randomValueWhere(arr, predicate) {
    if (!arr || arr.length === 0 || !predicate) {
        return null;
    }
    let value;
    let start = Date.now();
    do {
        if (Date.now() - start > 100) throw new Error('Possible infinite loop in randomValueWhere() predicate function');
        value = arr[(Math.floor(Math.random() * arr.length))];
    } while (!predicate(value));
    return value;
}
