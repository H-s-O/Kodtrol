import uniqid from 'uniqid';

export const updateScripts = (scripts) => ({
  type: 'UPDATE_SCRIPTS',
  payload: scripts,
});

export const selectScript = (id) => ({
  type: 'SELECT_SCRIPT',
  payload: id,
});

export const unselectScript = () => ({
  type: 'SELECT_SCRIPT',
  payload: null,
});

export const createScript = (scriptData) => ({
  type: 'CREATE_SCRIPT',
  payload: {
    content: '',
    previewTempo: 120,
    ...scriptData,
    id: uniqid(),
    lastUpdated: Date.now(),
  }
});

export const deleteScript = (id) => ({
  type: 'DELETE_SCRIPT',
  payload: id,
});

export const saveScript = (id, data) => ({
  type: 'SAVE_SCRIPT',
  payload: {
    id,
    data: {
      ...data,
      lastUpdated: Date.now(),
    },
  },
});

export const previewScript = (id) => ({
  type: 'PREVIEW_SCRIPT',
  payload: id,
});

export const stopPreviewScript = () => ({
  type: 'PREVIEW_SCRIPT',
  payload: null,
});