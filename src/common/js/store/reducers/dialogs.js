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
  SHOW_TIMELINE_DIALOG,
  UPDATE_TIMELINE_DIALOG,
  HIDE_TIMELINE_DIALOG,
  SHOW_BOARD_DIALOG,
  UPDATE_BOARD_DIALOG,
  HIDE_BOARD_DIALOG,
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
  //------------------------------
  timelineDialogOpened: false,
  timelineDialogMode: null,
  timelineDialogValue: null,
  //------------------------------
  boardDialogOpened: false,
  boardDialogMode: null,
  boardDialogValue: null,
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

    case SHOW_TIMELINE_DIALOG:
      return { ...state, timelineDialogOpened: true, timelineDialogMode: payload.mode, timelineDialogValue: payload.value };
      break;

    case UPDATE_TIMELINE_DIALOG:
      return { ...state, timelineDialogValue: payload };
      break;

    case HIDE_TIMELINE_DIALOG:
      return { ...state, timelineDialogOpened: false };
      break;

    //------------------------------------------------------------------------------

    case SHOW_BOARD_DIALOG:
      return { ...state, boardDialogOpened: true, boardDialogMode: payload.mode, boardDialogValue: payload.value };
      break;

    case UPDATE_BOARD_DIALOG:
      return { ...state, boardDialogValue: payload };
      break;

    case HIDE_BOARD_DIALOG:
      return { ...state, boardDialogOpened: false };
      break;

    //------------------------------------------------------------------------------

    default:
      return state;
      break;
  }
};
