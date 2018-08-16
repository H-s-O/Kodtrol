export default (state = null, {type, payload}) => {
  switch (type) {
    case 'SELECT_TIMELINE':
      return payload;
      break;
      
    case 'UPDATE_CURRENT_TIMELINE':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
};