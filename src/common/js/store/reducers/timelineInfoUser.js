export default (state = {}, {type, payload}) => {
  switch (type) {
    case 'UPDATE_TIMELINE_INFO_USER':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
};