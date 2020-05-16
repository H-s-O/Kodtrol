export default ({ name, devices }) => {
  if (!name) {
    return false;
  }
  if (!devices.every(({ device }) => !!device)) {
    return false;
  }
  return true;
}
