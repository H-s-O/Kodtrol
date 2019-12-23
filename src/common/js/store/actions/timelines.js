import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

const excludeHashProps = [
  'id',
  'name',
  'zoom',
  'zoomVert',
];

export const UPDATE_TIMELINES = 'update_timelines';
export const updateTimelinesAction = (timelines) => {
  return {
    type: UPDATE_TIMELINES,
    payload: timelines,
  };
};

export const EDIT_TIMELINE = 'edit_timeline';
export const editTimelineAction = (id) => {
  return {
    type: EDIT_TIMELINE,
    payload: id,
  };
};

export const CLOSE_TIMELINE = 'close_timeline';
export const closeTimelineAction = (id) => {
  return {
    type: CLOSE_TIMELINE,
    payload: id,
  };
};

export const CREATE_TIMELINE = 'create_timeline';
export const createTimelineAction = (data) => {
  const newData = {
    zoom: 1.0,
    zoomVert: 1.0,
    items: [],
    layers: [],
    tempo: null,
    ...data,
    id: uniqid(),
  };
  return {
    type: CREATE_TIMELINE,
    payload: {
      ...newData,
      hash: hashDataObject(newData, excludeHashProps),
    },
  };
};

export const DELETE_TIMELINE = 'delete_timeline';
export const deleteTimelineAction = (id) => {
  return {
    type: DELETE_TIMELINE,
    payload: id,
  };
};

export const SAVE_TIMELINE = 'save_timeline';
export const saveTimelineAction = (id, data) => {
  return {
    type: SAVE_TIMELINE,
    payload: {
      id,
      data: {
        ...data,
        hash: hashDataObject(data, excludeHashProps),
      },
    },
  };
};

export const RUN_TIMELINE = 'run_timeline';
export const runTimelineAction = (id) => {
  return {
    type: RUN_TIMELINE,
    payload: id,
  };
};

export const STOP_TIMELINE = 'stop_timeline';
export const stopTimelineAction = () => {
  return {
    type: STOP_TIMELINE,
    payload: null,
  };
};
