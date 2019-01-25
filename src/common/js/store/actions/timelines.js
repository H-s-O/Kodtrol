import uniqid from 'uniqid';

export const updateTimelines = (timelines) => ({
  type: 'UPDATE_TIMELINES',
  payload: timelines,
});

export const selectTimeline = (id) => ({
  type: 'SELECT_TIMELINE',
  payload: id,
});

export const unselectTimeline = () => ({
  type: 'SELECT_TIMELINE',
  payload: null,
});

export const createTimeline = (timelineData) => ({
  type: 'CREATE_TIMELINE',
  payload: {
    zoom: 1.0,
    items: [],
    layers: [],
    ...timelineData,
    id: uniqid(),
    lastUpdated: Date.now(),
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

export const saveTimeline = (timelineData) => ({
  type: 'SAVE_TIMELINE',
  payload: {
    ...timelineData,
    lastUpdated: Date.now(),
  },
});

export const updateCurrentTimeline = (timelineData) => ({
  type: 'UPDATE_CURRENT_TIMELINE',
  payload: timelineData,
});

export const runTimeline = (id) => ({
  type: 'RUN_TIMELINE',
  payload: id,
});

export const stopTimeline = () => ({
  type: 'RUN_TIMELINE',
  payload: null,
});
