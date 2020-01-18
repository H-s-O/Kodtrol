export default ({ name, type, address }) => {
  if (!name || !type) {
    return false;
  }
  if (type === 'dmx' && !address) {
    return false;
  }
  return true;
}
