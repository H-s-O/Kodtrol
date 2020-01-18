import {
  SHOW_ADD_DEVICE_DIALOG,
  HIDE_ADD_DEVICE_DIALOG,
  UPDATE_ADD_DEVICE_DIALOG,
  SHOW_EDIT_DEVICE_DIALOG,
  HIDE_EDIT_DEVICE_DIALOG,
  UPDATE_EDIT_DEVICE_DIALOG,
  SHOW_ADD_SCRIPT_DIALOG,
  HIDE_ADD_SCRIPT_DIALOG,
  UPDATE_ADD_SCRIPT_DIALOG,
  SHOW_EDIT_SCRIPT_DIALOG,
  HIDE_EDIT_SCRIPT_DIALOG,
  UPDATE_EDIT_SCRIPT_DIALOG,
} from '../actions/dialogs';

const defaultState = {
  addDeviceDialogOpened: false,
  addDeviceDialogValue: null,
  editDeviceDialogOpened: false,
  editDeviceDialogValue: null,
  //------------------------------
  addScriptDialogOpened: false,
  addScriptDialogValue: null,
  editScriptDialogOpened: false,
  editScriptDialogValue: null,
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

    case SHOW_EDIT_DEVICE_DIALOG:
      return { ...state, editDeviceDialogOpened: true, editDeviceDialogValue: payload };
      break;

    case HIDE_EDIT_DEVICE_DIALOG:
      return { ...state, editDeviceDialogOpened: false };
      break;

    case UPDATE_EDIT_DEVICE_DIALOG:
      return { ...state, editDeviceDialogValue: payload };
      break;

    //------------------------------------------------------------------------------

    case SHOW_ADD_SCRIPT_DIALOG:
      return { ...state, addScriptDialogOpened: true, addScriptDialogValue: null };
      break;

    case HIDE_ADD_SCRIPT_DIALOG:
      return { ...state, addScriptDialogOpened: false };
      break;

    case UPDATE_ADD_SCRIPT_DIALOG:
      return { ...state, addScriptDialogValue: payload };
      break;

    case SHOW_EDIT_SCRIPT_DIALOG:
      return { ...state, editScriptDialogOpened: true, editScriptDialogValue: payload };
      break;

    case HIDE_EDIT_SCRIPT_DIALOG:
      return { ...state, editScriptDialogOpened: false };
      break;

    case UPDATE_EDIT_SCRIPT_DIALOG:
      return { ...state, editScriptDialogValue: payload };
      break;

    //------------------------------------------------------------------------------

    default:
      return state;
      break;
  }
};
