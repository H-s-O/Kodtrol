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

export const updateScript = (scriptData) => ({
  type: 'UPDATE_SCRIPT',
  payload: scriptData,
});

export const deleteScript = (id) => ({
  type: 'DELETE_SCRIPT',
  payload: id,
});

export const saveScript = (id, content) => ({
  type: 'SAVE_SCRIPT',
  payload: {
    id,
    content,
    lastUpdated: Date.now(),
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