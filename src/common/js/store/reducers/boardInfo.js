const defaultState = {
};

export default (state = defaultState, {type, payload}) => {
  switch (type) {
    case 'UPDATE_BOARD_INFO':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
};