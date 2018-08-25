export default (state = null, {type, payload}) => {
  switch (type) {
    case 'PREVIEW_SCRIPT':
      return payload;
      break;
      
    default:
      return state;
      break;
  }
}