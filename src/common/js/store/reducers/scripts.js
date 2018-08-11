export default (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_SCRIPTS':
      return action.scripts;
      break;
      
    default:
      return state;
      break;
  }
}