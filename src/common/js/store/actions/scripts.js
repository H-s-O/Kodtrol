import uniqid from 'uniqid';

export const updateScripts = (scripts) => ({
  type: 'UPDATE_SCRIPTS',
  payload: scripts,
});

export const selectScript = (scriptData) => ({
  type: 'SELECT_SCRIPT',
  payload: scriptData,
});

export const createScript = (scriptData) => ({
  type: 'CREATE_SCRIPT',
  payload: {
    content: '',
    ...scriptData,
    id: uniqid(),
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

export const saveScript = (scriptData) => ({
  type: 'SAVE_SCRIPT',
  payload: scriptData,
});