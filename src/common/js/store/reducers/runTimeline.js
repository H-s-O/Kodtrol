export default (state = null, {type, payload}) => {
  switch (type) {
    case 'RUN_TIMELINE':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
}