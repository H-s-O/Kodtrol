export default function randomIndexWhere(arr, predicate) {
    if (!arr || arr.length === 0 || !predicate) {
        return null;
    }
    let index;
    do {
        index = (Math.floor(Math.random() * arr.length));
    } while (!predicate(index));
    return index;
}