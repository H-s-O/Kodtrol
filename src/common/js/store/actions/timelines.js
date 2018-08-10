export const updateTimelines = (timelines) => ({
  type: 'UPDATE_TIMELINES',
  timelines,
});

export const updateTimelineInfo = (timelineInfo) => ({
  type: 'UPDATE_TIMELINE_INFO',
  timelineInfo,
});

export const createTimeline = (timelineData) => ({
  type: 'CREATE_TIMELINE',
  timelineData,
});

export const updateTimeline = (timelineData) => ({
  type: 'UPDATE_TIMELINE',
  timelineData,
});

export const editTimeline = (timelineData) => ({
  type: 'EDIT_TIMELINE',
  currentTimeline: timelineData,
});