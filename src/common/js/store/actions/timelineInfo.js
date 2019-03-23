export const updateTimelineInfo = (timelineInfo) => {
  return {
    type: 'UPDATE_TIMELINE_INFO',
    payload: timelineInfo,
  };
};

export const updateTimelineInfoUser = (timelineInfo) => {
  return {
    type: 'UPDATE_TIMELINE_INFO_USER',
    payload: timelineInfo,
  };
};