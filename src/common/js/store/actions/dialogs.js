import { DIALOG_ADD, DIALOG_EDIT, DIALOG_IMPORT_ALL } from '../../constants/dialogs';

export const SHOW_DEVICE_DIALOG = 'show_device_dialog';
export const showDeviceDialogAction = (mode = DIALOG_ADD, value = null, local = false) => {
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
export const updateDeviceDialogAction = (value, local = false) => {
  return {
    type: UPDATE_DEVICE_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_DEVICE_DIALOG = 'hide_device_dialog';
export const hideDeviceDialogAction = (local = false) => {
  return {
    type: HIDE_DEVICE_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_SCRIPT_DIALOG = 'show_script_dialog';
export const showScriptDialogAction = (mode = DIALOG_ADD, value = null, local = false) => {
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
export const updateScriptDialogAction = (value, local = false) => {
  return {
    type: UPDATE_SCRIPT_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_SCRIPT_DIALOG = 'hide_script_dialog';
export const hideScriptDialogAction = (local = false) => {
  return {
    type: HIDE_SCRIPT_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_MEDIA_DIALOG = 'show_media_dialog';
export const showMediaDialogAction = (mode = DIALOG_ADD, value = null, local = false) => {
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
export const updateMediaDialogAction = (value, local = false) => {
  return {
    type: UPDATE_MEDIA_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_MEDIA_DIALOG = 'hide_media_dialog';
export const hideMediaDialogAction = (local = false) => {
  return {
    type: HIDE_MEDIA_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_TIMELINE_DIALOG = 'show_timeline_dialog';
export const showTimelineDialogAction = (mode = DIALOG_ADD, value = null, local = false) => {
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
export const updateTimelineDialogAction = (value, local = false) => {
  return {
    type: UPDATE_TIMELINE_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_TIMELINE_DIALOG = 'hide_timeline_dialog';
export const hideTimelineDialogAction = (local = false) => {
  return {
    type: HIDE_TIMELINE_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_BOARD_DIALOG = 'show_board_dialog';
export const showBoardDialogAction = (mode = DIALOG_ADD, value = null, local = false) => {
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
export const updateBoardDialogAction = (value, local = false) => {
  return {
    type: UPDATE_BOARD_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_BOARD_DIALOG = 'hide_board_dialog';
export const hideBoardDialogAction = (local = false) => {
  return {
    type: HIDE_BOARD_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_CONFIG_DIALOG = 'show_config_dialog';
export const showConfigDialogAction = (mode = DIALOG_EDIT, value = null, local = false) => {
  return {
    type: SHOW_CONFIG_DIALOG,
    payload: {
      mode,
      value,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_CONFIG_DIALOG = 'update_config_dialog';
export const updateConfigDialogAction = (value, local = false) => {
  return {
    type: UPDATE_CONFIG_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_CONFIG_DIALOG = 'hide_config_dialog';
export const hideConfigDialogAction = (local = false) => {
  return {
    type: HIDE_CONFIG_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_IMPORT_DIALOG = 'show_import_dialog';
export const showImportDialogAction = (mode = DIALOG_IMPORT_ALL, value = null, local = false) => {
  return {
    type: SHOW_IMPORT_DIALOG,
    payload: {
      mode,
      value,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_IMPORT_DIALOG = 'update_import_dialog';
export const updateImportDialogAction = (value, local = false) => {
  return {
    type: UPDATE_IMPORT_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_IMPORT_DIALOG = 'hide_import_dialog';
export const hideImportDialogAction = (local = false) => {
  return {
    type: HIDE_IMPORT_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}
