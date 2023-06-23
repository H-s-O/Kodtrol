export default (time, bpm) => {
  const quarterLength = (60000.0 / bpm) / 24.0;
  const ppq = (time / quarterLength) | 0; // faster floor
  return ppq;
};
