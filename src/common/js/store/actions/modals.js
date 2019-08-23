export const updateDeviceModal = (modalAction = null, modalValue = null, local = true) => {
  return {
    type: 'UPDATE_DEVICE_MODAL',
    payload: {
      modalAction,
      modalValue,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
};

export const updateScriptModal = (modalAction = null, modalValue = null, local = true) => {
  return {
    type: 'UPDATE_SCRIPT_MODAL',
    payload: {
      modalAction,
      modalValue,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
};

export const updateMediaModal = (modalAction = null, modalValue = null, local = true) => {
  return {
    type: 'UPDATE_MEDIA_MODAL',
    payload: {
      modalAction,
      modalValue,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
};

export const updateTimelineModal = (modalAction = null, modalValue = null, local = true) => {
  return {
    type: 'UPDATE_TIMELINE_MODAL',
    payload: {
      modalAction,
      modalValue,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
};

export const updateBoardModal = (modalAction = null, modalValue = null, local = true) => {
  return {
    type: 'UPDATE_BOARD_MODAL',
    payload: {
      modalAction,
      modalValue,
    },
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
};

export const updateConfigModal = (show = false, local = true) => {
  return {
    type: 'UPDATE_CONFIG_MODAL',
    payload: show,
    meta: local ? {
      scope: 'local',
    } : undefined,
  };
};