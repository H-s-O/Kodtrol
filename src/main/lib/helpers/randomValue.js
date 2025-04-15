/**
 * @function randomValue
 * @param {Array} arr 
 * @param {*} except 
 * @returns {*|null}
 */
export default function randomValue(arr, except = null) {
    if (!arr || arr.length === 0) {
        return null;
    }
    let value;
    let start = Date.now();
    do {
        if (Date.now() - start > 100) throw new Error('Possible infinite loop in randomValue() due to except value');
        value = arr[(Math.floor(Math.random() * arr.length))];
    } while (value == except);
    return value;
}
