export default ({ name, duration }) => {
  if (!name || !duration) {
    return false;
  }
  return true;
}
