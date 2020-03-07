export default ({ media, layer, inTime, outTime, volume }) => {
  if (!media || !layer) {
    return false;
  }
  if (isNaN(inTime) || isNaN(outTime) || isNaN(volume)) {
    return false;
  }
  return true;
}
