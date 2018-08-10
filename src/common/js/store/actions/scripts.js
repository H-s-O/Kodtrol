export const updateScripts = (scripts) => ({
  type: 'UPDATE_SCRIPTS',
  scripts,
});

export const editScript = (scriptData) => ({
  type: 'EDIT_SCRIPT',
  currentScript: scriptData,
});

export const createScript = (scriptData) => ({
  type: 'CREATE_SCRIPT',
  scriptData,
});

export const updateScript = (scriptData) => ({
  type: 'UPDATE_SCRIPT',
  scriptData,
});