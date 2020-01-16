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
