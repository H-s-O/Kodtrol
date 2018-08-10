export const updateScripts = (scripts) => ({
  type: 'UPDATE_SCRIPTS',
  payload: {
    scripts,
  },
});

export const editScript = (scriptData) => ({
  type: 'EDIT_SCRIPT',
  payload: {
    currentScript: scriptData,
  },
});

export const updateDevices = (devices) => ({
  type: 'UPDATE_DEVICES',
  payload: {
    devices,
  },
});

export const updateTimelines = (timelines) => ({
  type: 'UPDATE_TIMELINES',
  payload: {
    timelines,
  },
});

export const updateTimelineInfo = (timelineInfo) => ({
  type: 'UPDATE_TIMELINE_INFO',
  payload: {
    timelineInfo,
  },
});

export const editTimeline = (timelineData) => ({
  type: 'EDIT_TIMELINE',
  payload: {
    currentTimeline: timelineData,
  },
});
