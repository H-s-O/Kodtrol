export default ({ script, layer, behavior, trigger, triggerSource }) => {
  if (!script || !layer || !behavior) {
    return false;
  }
  if (trigger && !triggerSource) {
    return false;
  }
  return true;
}
