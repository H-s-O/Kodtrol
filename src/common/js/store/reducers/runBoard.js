export default (state = null, {type, payload}) => {
  switch (type) {
    case 'RUN_BOARD':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
}