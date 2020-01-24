export default (currentValue, newValue, name) => {
  if (typeof newValue === 'object' && typeof name === 'undefined') {
    return { ...currentValue, ...newValue };
  }
  return { ...currentValue, [name]: newValue };
}
