import uniqid from 'uniqid';

import hash from '../../lib/hash';

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
    hash: hash(timelineData),
  },
});

export const deleteTimeline = (id) => ({
  type: 'DELETE_TIMELINE',
  payload: id,
});

export const saveTimeline = (id, data) => ({
  type: 'SAVE_TIMELINE',
  payload: {
    id,
    data: {
      ...data,
      hash: hash(data),
    },
  },
});

export const runTimeline = (id) => ({
  type: 'RUN_TIMELINE',
  payload: id,
});

export const stopTimeline = () => ({
  type: 'RUN_TIMELINE',
  payload: null,
});
