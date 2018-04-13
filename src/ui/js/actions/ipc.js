export const updateScripts = (event, scripts) => ({
  type: 'UPDATE_SCRIPTS',
  scripts,
});

export const editScript = (event, script) => ({
  type: 'EDIT_SCRIPT',
  currentScript: script,
});

export const updateDevices = (event, devices) => ({
  type: 'UPDATE_DEVICES',
  devices,
});
