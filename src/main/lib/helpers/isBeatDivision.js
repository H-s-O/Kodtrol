export default function isBeatDivision(beat, division, allowFirst = false) {
    if (allowFirst) {
        return (beat === 0 || beat % division === 0);
    }
    return (beat > 0 && beat % division === 0);
}