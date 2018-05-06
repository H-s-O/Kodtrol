export const updateScripts = (event, scripts) => ({
  type: 'UPDATE_SCRIPTS',
  scripts,
});

export const editScript = (event, scriptData) => ({
  type: 'EDIT_SCRIPT',
  currentScript: scriptData,
});

export const updateDevices = (event, devices) => ({
  type: 'UPDATE_DEVICES',
  devices,
});

export const updateTimelines = (event, timelines) => ({
  type: 'UPDATE_TIMELINES',
  timelines,
});

export const updateTimelineInfo = (event, timelineInfo) => ({
  type: 'UPDATE_TIMELINE_INFO',
  timelineInfo,
});

export const editTimeline = (event, timelineData) => ({
  type: 'EDIT_TIMELINE',
  currentTimeline: timelineData,
});
