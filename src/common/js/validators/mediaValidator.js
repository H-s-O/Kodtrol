export default ({ file, duration, codec }) => {
  if (!file || !duration || !codec) {
    return false;
  }
  return true;
}
