export default (state = {}, {type, payload}) => {
  switch (type) {
    case 'UPDATE_TIMELINE_INFO':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
};