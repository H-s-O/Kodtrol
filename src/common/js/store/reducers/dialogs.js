import {
  SHOW_ADD_DEVICE_DIALOG,
  HIDE_ADD_DEVICE_DIALOG,
  UPDATE_ADD_DEVICE_DIALOG,
} from '../actions/dialogs';

const defaultState = {
  addDeviceDialogOpened: false,
  addDeviceDialogValue: null,
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case SHOW_ADD_DEVICE_DIALOG:
      return { ...state, addDeviceDialogOpened: true, addDeviceDialogValue: null };
      break;

    case HIDE_ADD_DEVICE_DIALOG:
      return { ...state, addDeviceDialogOpened: false };
      break;

    case UPDATE_ADD_DEVICE_DIALOG:
      return { ...state, addDeviceDialogValue: payload };
      break;

    default:
      return state;
      break;
  }
};
