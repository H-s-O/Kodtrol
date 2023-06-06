export default function map(value, valueMin, valueMax, outMin, outMax) {
    return (outMin + (((value - valueMin) / (valueMax - valueMin) * (outMax - outMin))));
}