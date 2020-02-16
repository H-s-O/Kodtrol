export default ({ name, devices }) => {
  if (!name) {
    return false;
  }
  if (!devices.every(({ id }) => !!id)) {
    return false;
  }
  return true;
}
