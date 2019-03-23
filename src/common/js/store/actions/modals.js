export const updateDeviceModal = (modalAction = null, modalValue = null) => {
  return {
    type: 'UPDATE_DEVICE_MODAL',
    payload: {
      modalAction,
      modalValue,
    },
    meta: {
      scope: 'local',
    },
  };
};

export const updateScriptModal = (modalAction = null, modalValue = null) => {
  return {
    type: 'UPDATE_SCRIPT_MODAL',
    payload: {
      modalAction,
      modalValue,
    },
    meta: {
      scope: 'local',
    },
  };
};

export const updateTimelineModal = (modalAction = null, modalValue = null) => {
  return {
    type: 'UPDATE_TIMELINE_MODAL',
    payload: {
      modalAction,
      modalValue,
    },
    meta: {
      scope: 'local',
    },
  };
};

export const updateBoardModal = (modalAction = null, modalValue = null) => {
  return {
    type: 'UPDATE_BOARD_MODAL',
    payload: {
      modalAction,
      modalValue,
    },
    meta: {
      scope: 'local',
    },
  };
};

export const updateConfigModal = (show = false) => {
  return {
    type: 'UPDATE_CONFIG_MODAL',
    payload: show,
    meta: {
      scope: 'local',
    },
  };
};