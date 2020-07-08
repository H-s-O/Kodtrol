export default ({ file, duration, codec }) => {
  if (!file || !duration) {
    return false;
  }
  return true;
}
