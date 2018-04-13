export default (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_SCRIPTS':
      return {
        ...state,
        scripts: action.scripts.map((script) => {
          return {
            icon: 'file',
            label: script.name,
          };
        }),
      };
      break;

    case 'UPDATE_DEVICES':
      return {
        ...state,
        devices: action.devices.map((device) => {
          return {
            icon: 'modal-window',
            label: device.name,
          };
        }),
      };
      break;

    case 'EDIT_SCRIPT':
      console.log('EDIT_SCRIPT', action);
      return {
        ...state,
        currentScript: action.currentScript,
      };
      break;

    default:
      return state;
      break;
  }
};
