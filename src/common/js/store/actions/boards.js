import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

const excludeHashProps = [
  'id',
  'name',
];

export const updateBoards = (boards) => {
  return {
    type: 'UPDATE_BOARDS',
    payload: boards,
  };
};

export const selectBoard = (id) => {
  return {
    type: 'SELECT_BOARD',
    payload: id,
  };
};

export const unselectBoard = () => {
  return {
    type: 'SELECT_BOARD',
    payload: null,
  };
};

export const createBoard = (data) => {
  const newData = {
    zoom: 1.0,
    zoomVert: 1.0,
    items: [],
    layers: [],
    ...data,
    id: uniqid(),
  };
  return {
    type: 'CREATE_BOARD',
    payload: {
      ...newData,
      hash: hashDataObject(newData, excludeHashProps),
    },
  };
};

export const deleteBoard = (id) => {
  return {
    type: 'DELETE_BOARD',
    payload: id,
  };
};

export const saveBoard = (id, data) => {
  return {
    type: 'SAVE_BOARD',
    payload: {
      id,
      data: {
        ...data,
        hash: hashDataObject(data, excludeHashProps),
      },
    },
  };
};

export const runBoard = (id) => {
  return {
    type: 'RUN_BOARD',
    payload: id,
  };
};

export const stopBoard = () => {
  return {
    type: 'RUN_BOARD',
    payload: null,
  };
};
