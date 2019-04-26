import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

const excludeHashProps = [
  'id',
  'name',
  'zoom',
  'zoomVert',
];

export const updateTimelines = (timelines) => {
  return {
    type: 'UPDATE_TIMELINES',
    payload: timelines,
  };
};

export const selectTimeline = (id) => {
  return {
    type: 'SELECT_TIMELINE',
    payload: id,
  };
};

export const unselectTimeline = () => {
  return {
    type: 'SELECT_TIMELINE',
    payload: null,
  };
};

export const createTimeline = (data) => {
  const newData = {
    zoom: 1.0,
    zoomVert: 1.0,
    items: [],
    layers: [],
    ...data,
    id: uniqid(),
  };
  return {
    type: 'CREATE_TIMELINE',
    payload: {
      ...newData,
      hash: hashDataObject(newData, excludeHashProps),
    },
  };
};

export const deleteTimeline = (id) => {
  return {
    type: 'DELETE_TIMELINE',
    payload: id,
  };
};

export const saveTimeline = (id, data) => {
  return {
    type: 'SAVE_TIMELINE',
    payload: {
      id,
      data: {
        ...data,
        hash: hashDataObject(data, excludeHashProps),
      },
    },
  };
};

export const runTimeline = (id) => {
  return {
    type: 'RUN_TIMELINE',
    payload: id,
  };
};

export const stopTimeline = () => {
  return {
    type: 'RUN_TIMELINE',
    payload: null,
  };
};
