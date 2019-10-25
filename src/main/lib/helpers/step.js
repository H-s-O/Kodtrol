export default function step(value, step = 1) {
    return (Math.round(value / step) * step);
}