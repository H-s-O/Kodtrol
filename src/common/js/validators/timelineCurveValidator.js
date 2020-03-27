export default ({ layer, name, inTime, outTime }) => {
  if (!layer || !name) {
    return false;
  }
  if (isNaN(inTime) || isNaN(outTime)) {
    return false;
  }
  return true;
}
