export default ({ script, layer, inTime, outTime }) => {
  if (!script || !layer) {
    return false;
  }
  if (isNaN(inTime) || isNaN(outTime)) {
    return false;
  }
  return true;
}
