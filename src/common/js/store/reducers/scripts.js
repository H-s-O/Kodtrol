export default (state = [], {type, payload}) => {
  switch (type) {
    case 'UPDATE_SCRIPTS':
      return payload.scripts;
      break;
      
    default:
      return state;
      break;
  }
}