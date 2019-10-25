export default function mix(a, b, percent = 0.5, type = 'linear') {
    return a + ((b - a) * percent);
}