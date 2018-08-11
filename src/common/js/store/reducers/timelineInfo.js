export default (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_TIMELINE_INFO':
      return action.timelineInfo;
      break;
      
    default:
      return state;
      break;
  }
};