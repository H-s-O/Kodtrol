import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

const excludeHashProps = [
  'id',
  'name',
];

export const updateScripts = (scripts) => {
  return {
    type: 'UPDATE_SCRIPTS',
    payload: scripts,
  };
};

export const selectScript = (id) => {
  return {
    type: 'SELECT_SCRIPT',
    payload: id,
  };
};

export const unselectScript = () => {
  return {
    type: 'SELECT_SCRIPT',
    payload: null,
  };
};

export const createScript = (data) => {
  const newData = {
    content: '',
    previewTempo: 120,
    devices: [],
    ...data,
    id: uniqid(),
  };
  return {
    type: 'CREATE_SCRIPT',
    payload: {
      ...newData,
      hash: hashDataObject(newData, excludeHashProps),
    }
  };
};

export const deleteScript = (id) => {
  return {
    type: 'DELETE_SCRIPT',
    payload: id,
  };
};

export const saveScript = (id, data) => {
  return {
    type: 'SAVE_SCRIPT',
    payload: {
      id,
      data: {
        ...data,
        hash: hashDataObject(data, excludeHashProps),
      },
    },
  };
};

export const previewScript = (id) => {
  return {
    type: 'PREVIEW_SCRIPT',
    payload: id,
  };
};

export const stopPreviewScript = () => {
  return {
    type: 'PREVIEW_SCRIPT',
    payload: null,
  };
};