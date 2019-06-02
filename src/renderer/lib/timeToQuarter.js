export default (time, bpm) => {
    const quarterLength = (60000.0 / bpm) / 24.0; 
    const quarterPos = Math.round(time / quarterLength);
    return quarterPos;
};