export default (state = null, {type, payload}) => {
  switch (type) {
    case 'UPDATE_BOARD_INFO_USER':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
};