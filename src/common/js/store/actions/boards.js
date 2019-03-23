import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

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
  const hashableData = {
    items: [],
    layers: [],
    ...data,
  };
  return {
    type: 'CREATE_BOARD',
    payload: {
      ...hashableData,
      id: uniqid(),
      hash: hashDataObject(hashableData),
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
        hash: hashDataObject(data),
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
