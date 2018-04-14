export const updateScripts = (event, scripts) => ({
  type: 'UPDATE_SCRIPTS',
  scripts,
});

export const editScript = (event, scriptData) => ({
  type: 'EDIT_SCRIPT',
  currentScript: scriptData,
});

export const updateDevices = (event, devices) => ({
  type: 'UPDATE_DEVICES',
  devices,
});
