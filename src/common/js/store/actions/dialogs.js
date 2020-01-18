export const SHOW_ADD_DEVICE_DIALOG = 'show_add_device_dialog';
export const showAddDeviceDialogAction = (local = true) => {
  return {
    type: SHOW_ADD_DEVICE_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_ADD_DEVICE_DIALOG = 'hide_add_device_dialog';
export const hideAddDeviceDialogAction = (local = true) => {
  return {
    type: HIDE_ADD_DEVICE_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_ADD_DEVICE_DIALOG = 'update_add_device_dialog';
export const updateAddDeviceDialogAction = (value, local = true) => {
  return {
    type: UPDATE_ADD_DEVICE_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const SHOW_EDIT_DEVICE_DIALOG = 'show_edit_device_dialog';
export const showEditDeviceDialogAction = (value, local = true) => {
  return {
    type: SHOW_EDIT_DEVICE_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_EDIT_DEVICE_DIALOG = 'hide_edit_device_dialog';
export const hideEditDeviceDialogAction = (local = true) => {
  return {
    type: HIDE_EDIT_DEVICE_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_EDIT_DEVICE_DIALOG = 'update_edit_device_dialog';
export const updateEditDeviceDialogAction = (value, local = true) => {
  return {
    type: UPDATE_EDIT_DEVICE_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

//--------------------------------------------------------------------------

export const SHOW_ADD_SCRIPT_DIALOG = 'show_add_script_dialog';
export const showAddScriptDialogAction = (local = true) => {
  return {
    type: SHOW_ADD_SCRIPT_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_ADD_SCRIPT_DIALOG = 'hide_add_script_dialog';
export const hideAddScriptDialogAction = (local = true) => {
  return {
    type: HIDE_ADD_SCRIPT_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_ADD_SCRIPT_DIALOG = 'update_add_script_dialog';
export const updateAddScriptDialogAction = (value, local = true) => {
  return {
    type: UPDATE_ADD_SCRIPT_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const SHOW_EDIT_SCRIPT_DIALOG = 'show_edit_script_dialog';
export const showEditScriptDialogAction = (value, local = true) => {
  return {
    type: SHOW_EDIT_SCRIPT_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const HIDE_EDIT_SCRIPT_DIALOG = 'hide_edit_script_dialog';
export const hideEditScriptDialogAction = (local = true) => {
  return {
    type: HIDE_EDIT_SCRIPT_DIALOG,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}

export const UPDATE_EDIT_SCRIPT_DIALOG = 'update_edit_script_dialog';
export const updateEditScriptDialogAction = (value, local = true) => {
  return {
    type: UPDATE_EDIT_SCRIPT_DIALOG,
    payload: value,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
}
