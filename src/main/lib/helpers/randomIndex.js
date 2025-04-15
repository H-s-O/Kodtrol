/**
 * @function randomIndex
 * @param {Array} arr 
 * @param {*} except 
 * @returns {Number|null}
 */
export default function randomIndex(arr, except = null) {
    if (!arr || arr.length === 0) {
        return null;
    }
    let index;
    let start = Date.now();
    do {
        if (Date.now() - start > 100) throw new Error('Possible infinite loop in randomIndex() due to except value');
        index = (Math.floor(Math.random() * arr.length));
    } while (index == except);
    return index;
}
