export default (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_TIMELINES':
      return action.timelines;
      break;
      
    default:
      return state;
      break;
  }
};