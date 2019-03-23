import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

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
  const hashableData = {
    content: '',
    previewTempo: 120,
    devices: [],
    ...data,
  };
  return {
    type: 'CREATE_SCRIPT',
    payload: {
      ...hashableData,
      id: uniqid(),
      hash: hashDataObject(hashableData),
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
  console.log(id, data);
  return {
    type: 'SAVE_SCRIPT',
    payload: {
      id,
      data: {
        ...data,
        hash: hashDataObject(data),
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