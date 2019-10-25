export default function randomValueWhere(arr, predicate) {
    if (!arr || arr.length === 0 || !predicate) {
        return null;
    }
    let value;
    do {
        value = arr[(Math.floor(Math.random() * arr.length))];
    } while (!predicate(value));
    return value;
}