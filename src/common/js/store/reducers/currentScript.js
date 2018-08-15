export default (state = null, {type, payload}) => {
  switch (type) {
    case 'SELECT_SCRIPT':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
}