export const updateScripts = (scripts) => ({
  type: 'UPDATE_SCRIPTS',
  scripts,
});

export const editScript = (scriptData) => ({
  type: 'EDIT_SCRIPT',
  currentScript: scriptData,
});