import uniqid from 'uniqid';

export const updateScripts = (scripts) => ({
  type: 'UPDATE_SCRIPTS',
  payload: scripts,
});

export const selectScript = (id) => ({
  type: 'SELECT_SCRIPT',
  payload: id,
});

export const createScript = (scriptData) => ({
  type: 'CREATE_SCRIPT',
  payload: {
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