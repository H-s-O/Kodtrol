const defaultState = {
  deviceModalAction: null,
  deviceModalValue: null,
  scriptModalAction: null,
  scriptModalValue: null,
  mediaModalAction: null,
  mediaModalValue: null,
  timelineModalAction: null,
  timelineModalValue: null,
  boardModalAction: null,
  boardModalValue: null,
  importFromProjectModalAction: null,
  importFromProjectModalValue: null,
  showConfigModal: false,
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
    
    case 'UPDATE_MEDIA_MODAL':
      return {
        ...state,
        ...{
          mediaModalAction: payload.modalAction,
          mediaModalValue: payload.modalValue,
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
    
    
    case 'UPDATE_IMPORT_FROM_PROJECT_MODAL':
      return {
        ...state,
        ...{
          importFromProjectModalAction: payload.modalAction,
          importFromProjectModalValue: payload.modalValue,
        },
      };
      break;
    
    case 'UPDATE_CONFIG_MODAL':
      return {
        ...state,
        ...{
          showConfigModal: payload,
        },
      };
      break;
      
    default:
      return state;
      break;
  }
}