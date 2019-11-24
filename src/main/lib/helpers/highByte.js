export default function highByte(value) {
    return (value >> 8) & 0xFF;
}