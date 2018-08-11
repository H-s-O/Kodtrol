export default (state = [], {type, payload}) => {
  switch (type) {
    case 'UPDATE_TIMELINES':
      return payload.timelines;
      break;
      
    default:
      return state;
      break;
  }
};