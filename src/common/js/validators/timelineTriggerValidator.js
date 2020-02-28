export default ({ layer, name, inTime }) => {
  if (!layer || !name) {
    return false;
  }
  if (isNaN(inTime)) {
    return false;
  }
  return true;
}
