export default (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_DEVICE_MODAL':
      return {
        ...state,
        ...{
          scriptModalAction: action.modalAction,
          scriptModalValue: action.modalValue,
        },
      };
      break;
      
    default:
      return state;
      break;
  }
}