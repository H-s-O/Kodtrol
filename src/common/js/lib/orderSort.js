export default ({ order: a }, { order: b }) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 1;
}
