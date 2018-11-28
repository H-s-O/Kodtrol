const defaultState = {
  deviceModalAction: null,
  deviceModalValue: null,
  scriptModalAction: null,
  scriptModalValue: null,
  timelineModalAction: null,
  timelineModalValue: null,
  boardModalAction: null,
  boardModalValue: null,
};

export default (state = defaultState, {type, payload}) => {
  switch (type) {
    case 'UPDATE_DEVICE_MODAL':
      return {
        ...state,
        ...{
          deviceModalAction: payload.modalAction,
          deviceModalValue: payload.modalValue,
        },
      };
      break;
    
    case 'UPDATE_SCRIPT_MODAL':
      return {
        ...state,
        ...{
          scriptModalAction: payload.modalAction,
          scriptModalValue: payload.modalValue,
        },
      };
      break;
    
    case 'UPDATE_TIMELINE_MODAL':
      return {
        ...state,
        ...{
          timelineModalAction: payload.modalAction,
          timelineModalValue: payload.modalValue,
        },
      };
      break;
    
    case 'UPDATE_BOARD_MODAL':
      return {
        ...state,
        ...{
          boardModalAction: payload.modalAction,
          boardModalValue: payload.modalValue,
        },
      };
      break;
      
    default:
      return state;
      break;
  }
}