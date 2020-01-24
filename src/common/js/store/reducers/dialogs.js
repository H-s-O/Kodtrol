import {
  SHOW_DEVICE_DIALOG,
  UPDATE_DEVICE_DIALOG,
  HIDE_DEVICE_DIALOG,
  SHOW_SCRIPT_DIALOG,
  UPDATE_SCRIPT_DIALOG,
  HIDE_SCRIPT_DIALOG,
  SHOW_MEDIA_DIALOG,
  UPDATE_MEDIA_DIALOG,
  HIDE_MEDIA_DIALOG,
} from '../actions/dialogs';

const defaultState = {
  deviceDialogOpened: false,
  deviceDialogMode: null,
  deviceDialogValue: null,
  //------------------------------
  scriptDialogOpened: false,
  scriptDialogMode: null,
  scriptDialogValue: null,
  //------------------------------
  mediaDialogOpened: false,
  mediaDialogMode: null,
  mediaDialogValue: null,
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case SHOW_DEVICE_DIALOG:
      return { ...state, deviceDialogOpened: true, deviceDialogMode: payload.mode, deviceDialogValue: payload.value };
      break;

    case UPDATE_DEVICE_DIALOG:
      return { ...state, deviceDialogValue: payload };
      break;

    case HIDE_DEVICE_DIALOG:
      return { ...state, deviceDialogOpened: false };
      break;

    //------------------------------------------------------------------------------

    case SHOW_SCRIPT_DIALOG:
      return { ...state, scriptDialogOpened: true, scriptDialogMode: payload.mode, scriptDialogValue: payload.value };
      break;

    case UPDATE_SCRIPT_DIALOG:
      return { ...state, scriptDialogValue: payload };
      break;

    case HIDE_SCRIPT_DIALOG:
      return { ...state, scriptDialogOpened: false };
      break;

    //------------------------------------------------------------------------------

    case SHOW_MEDIA_DIALOG:
      return { ...state, mediaDialogOpened: true, mediaDialogMode: payload.mode, mediaDialogValue: payload.value };
      break;

    case UPDATE_MEDIA_DIALOG:
      return { ...state, mediaDialogValue: payload };
      break;

    case HIDE_MEDIA_DIALOG:
      return { ...state, mediaDialogOpened: false };
      break;

    //------------------------------------------------------------------------------

    default:
      return state;
      break;
  }
};
