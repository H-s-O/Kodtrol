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

export const createTimeline = (timelineData) => ({
  type: 'CREATE_TIMELINE',
  payload: {
    timelineData,
  },
});

export const updateTimeline = (timelineData) => ({
  type: 'UPDATE_TIMELINE',
  payload: {
    timelineData,
  },
});

export const editTimeline = (timelineData) => ({
  type: 'EDIT_TIMELINE',
  payload: {
    currentTimeline: timelineData,
  },
});