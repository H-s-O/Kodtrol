export default (state = {}, {type, payload}) => {
  switch (type) {
    case 'UPDATE_TIMELINE_INFO':
      return payload.timelineInfo;
      break;
      
    default:
      return state;
      break;
  }
};