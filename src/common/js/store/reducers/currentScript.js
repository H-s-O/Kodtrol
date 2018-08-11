export default (state = null, {type, payload}) => {
  switch (type) {
    case 'EDIT_SCRIPT':
      return payload.currentScript;
      break;
      
    default:
      return state;
      break;
  }
}