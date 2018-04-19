export default (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_SCRIPTS':
      return {
        ...state,
        scripts: action.scripts.map((script) => {
          return {
            id: script.id,
            icon: 'file',
            label: script.name,
            active: script.current,
          };
        }),
      };
      break;

    case 'UPDATE_DEVICES':
      return {
        ...state,
        devices: action.devices.map((device) => {
          return {
            id: device.id,
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
