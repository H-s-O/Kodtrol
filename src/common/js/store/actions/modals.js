export const updateDeviceModal = (modalAction = null, modalValue = null) => ({
  type: 'UPDATE_DEVICE_MODAL',
  payload: {
    modalAction,
    modalValue,
  },
  meta: {
    scope: 'local',
  },
});

export const updateScriptModal = (modalAction = null, modalValue = null) => ({
  type: 'UPDATE_SCRIPT_MODAL',
  payload: {
    modalAction,
    modalValue,
  },
  meta: {
    scope: 'local',
  },
});

export const updateTimelineModal = (modalAction = null, modalValue = null) => ({
  type: 'UPDATE_TIMELINE_MODAL',
  payload: {
    modalAction,
    modalValue,
  },
  meta: {
    scope: 'local',
  },
});

export const updateBoardModal = (modalAction = null, modalValue = null) => ({
  type: 'UPDATE_BOARD_MODAL',
  payload: {
    modalAction,
    modalValue,
  },
  meta: {
    scope: 'local',
  },
});