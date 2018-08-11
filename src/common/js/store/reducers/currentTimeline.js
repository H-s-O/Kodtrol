export default (state = null, {type, payload}) => {
  switch (type) {
    case 'EDIT_TIMELINE':
      return payload.currentTimeline;
      break;
      
    default:
      return state;
      break;
  }
};