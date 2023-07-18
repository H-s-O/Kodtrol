export default (time: number, bpm: number): number => {
  const quarterLength = (60000.0 / bpm) / 24.0;
  const ppq = (time / quarterLength) | 0; // faster floor
  return ppq;
};
