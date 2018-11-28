export default (state = null, {type, payload}) => {
  switch (type) {
    case 'SELECT_BOARD':
      return payload;
      break;
      
    case 'UPDATE_CURRENT_BOARD':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
};