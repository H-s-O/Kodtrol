import uniqid from 'uniqid';

export const updateTimelines = (timelines) => ({
  type: 'UPDATE_TIMELINES',
  payload: timelines,
});

export const selectTimeline = (id) => ({
  type: 'SELECT_TIMELINE',
  payload: id,
});

export const createTimeline = (timelineData) => ({
  type: 'CREATE_TIMELINE',
  payload: {
    ...timelineData,
    zoom: 1.0,
    id: uniqid(),
  },
});

export const updateTimeline = (timelineData) => ({
  type: 'UPDATE_TIMELINE',
  payload: timelineData,
});

export const deleteTimeline = (id) => ({
  type: 'DELETE_TIMELINE',
  payload: id,
});