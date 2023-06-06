export default function randomIndex(arr, except = null) {
    if (!arr || arr.length === 0) {
        return null;
    }
    let index;
    do {
        index = (Math.floor(Math.random() * arr.length));
    } while (index == except);
    return index;
}