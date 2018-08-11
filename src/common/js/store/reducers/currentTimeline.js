export default (state = null, action) => {
  switch (action.type) {
    case 'EDIT_TIMELINE':
      return action.currentTimeline;
      break;
      
    default:
      return state;
      break;
  }
};