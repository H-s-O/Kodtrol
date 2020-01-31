import { DIALOG_ADD } from '../../constants/dialogs';

export const SHOW_DEVICE_DIALOG = 'show_device_dialog';
export const showDeviceDialogAction = (mode = DIALOG_ADD, value = null, local = true) => {
  return {
    type: SHOW_DEVICE_DIALOG,
    payload: {
      mode,
      value,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_DEVICE_DIALOG = 'update_device_dialog';
export const updateDeviceDialogAction = (value, local = true) => {
  return {
    type: UPDATE_DEVICE_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_DEVICE_DIALOG = 'hide_device_dialog';
export const hideDeviceDialogAction = (local = true) => {
  return {
    type: HIDE_DEVICE_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_SCRIPT_DIALOG = 'show_script_dialog';
export const showScriptDialogAction = (mode = DIALOG_ADD, value = null, local = true) => {
  return {
    type: SHOW_SCRIPT_DIALOG,
    payload: {
      mode,
      value,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_SCRIPT_DIALOG = 'update_script_dialog';
export const updateScriptDialogAction = (value, local = true) => {
  return {
    type: UPDATE_SCRIPT_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_SCRIPT_DIALOG = 'hide_script_dialog';
export const hideScriptDialogAction = (local = true) => {
  return {
    type: HIDE_SCRIPT_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_MEDIA_DIALOG = 'show_media_dialog';
export const showMediaDialogAction = (mode = DIALOG_ADD, value = null, local = true) => {
  return {
    type: SHOW_MEDIA_DIALOG,
    payload: {
      mode,
      value,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_MEDIA_DIALOG = 'update_media_dialog';
export const updateMediaDialogAction = (value, local = true) => {
  return {
    type: UPDATE_MEDIA_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_MEDIA_DIALOG = 'hide_media_dialog';
export const hideMediaDialogAction = (local = true) => {
  return {
    type: HIDE_MEDIA_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_TIMELINE_DIALOG = 'show_timeline_dialog';
export const showTimelineDialogAction = (mode = DIALOG_ADD, value = null, local = true) => {
  return {
    type: SHOW_TIMELINE_DIALOG,
    payload: {
      mode,
      value,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_TIMELINE_DIALOG = 'update_timeline_dialog';
export const updateTimelineDialogAction = (value, local = true) => {
  return {
    type: UPDATE_TIMELINE_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_TIMELINE_DIALOG = 'hide_timeline_dialog';
export const hideTimelineDialogAction = (local = true) => {
  return {
    type: HIDE_TIMELINE_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_BOARD_DIALOG = 'show_board_dialog';
export const showBoardDialogAction = (mode = DIALOG_ADD, value = null, local = true) => {
  return {
    type: SHOW_BOARD_DIALOG,
    payload: {
      mode,
      value,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_BOARD_DIALOG = 'update_board_dialog';
export const updateBoardDialogAction = (value, local = true) => {
  return {
    type: UPDATE_BOARD_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_BOARD_DIALOG = 'hide_board_dialog';
export const hideBoardDialogAction = (local = true) => {
  return {
    type: HIDE_BOARD_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}
