export default (state = null, action) => {
  switch (action.type) {
    case 'EDIT_SCRIPT':
      return action.currentScript;
      break;
      
    default:
      return state;
      break;
  }
}