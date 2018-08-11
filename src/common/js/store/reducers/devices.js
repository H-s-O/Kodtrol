export default (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_DEVICES':
      return action.devices;
      break;
      
    default:
      return state;
      break;
  }
}