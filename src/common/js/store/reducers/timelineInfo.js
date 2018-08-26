export default (state = {}, {type, payload}) => {
  switch (type) {
    case 'UPDATE_TIMELINE_INFO':
      return payload;
      break;
    
    case 'UPDATE_TIMELINE_POSITION':
      return {
        ...payload,
        position: payload,
      };
      break;
      
    default:
      return state;
      break;
  }
};