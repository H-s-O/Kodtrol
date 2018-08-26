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

export const saveTimeline = (timelineData) => ({
  type: 'SAVE_TIMELINE',
  payload: timelineData,
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
