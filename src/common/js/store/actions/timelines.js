import uniqid from 'uniqid';

export const updateTimelines = (timelines) => ({
  type: 'UPDATE_TIMELINES',
  payload: timelines,
});

export const selectTimeline = (timelineData) => ({
  type: 'SELECT_TIMELINE',
  payload: timelineData,
});

export const createTimeline = (timelineData) => ({
  type: 'CREATE_TIMELINE',
  payload: {
    zoom: 1.0,
    layers: [],
    ...timelineData,
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