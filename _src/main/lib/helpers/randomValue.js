export default function randomValue(arr, except = null) {
    if (!arr || arr.length === 0) {
        return null;
    }
    let value;
    do {
        value = arr[(Math.floor(Math.random() * arr.length))];
    } while (value == except);
    return value;
}