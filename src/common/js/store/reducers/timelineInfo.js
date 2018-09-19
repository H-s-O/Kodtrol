const defaultState = {
  position: 0,
  playing: false,
};

export default (state = defaultState, {type, payload}) => {
  switch (type) {
    case 'UPDATE_TIMELINE_INFO':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
};