export const updateTimelines = (timelines) => ({
  type: 'UPDATE_TIMELINES',
  timelines,
});

export const updateTimelineInfo = (timelineInfo) => ({
  type: 'UPDATE_TIMELINE_INFO',
  timelineInfo,
});

export const editTimeline = (timelineData) => ({
  type: 'EDIT_TIMELINE',
  currentTimeline: timelineData,
});