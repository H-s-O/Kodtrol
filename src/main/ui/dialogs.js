import { dialog } from 'electron';

import { PROJECT_FILE_EXTENSION, APP_NAME } from '../../common/js/constants/app';

export const createProjectDialog = (win = null) => {
  const options = {
    title: 'Create project',
  }
  let result;
  if (win) {
    result = dialog.showSaveDialogSync(win, options);
  } else {
    result = dialog.showSaveDialogSync(options);
  }
  return result || null;
};

export const openProjectDialog = (win = null) => {
  const options = {
    title: 'Open project',
    filters: [
      {
        name: `${APP_NAME} files`,
        extensions: [PROJECT_FILE_EXTENSION],
      },
    ],
  };
  let result;
  if (win) {
    result = dialog.showOpenDialogSync(win, options);
  } else {
    result = dialog.showOpenDialogSync(options);
  }
  return result && result.length ? result[0] : null;
};

export const warnBeforeClosingProject = (win = null) => {
  const options = {
    type: 'warning',
    buttons: [
      'Close', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message: 'Are you sure you want to close this project?',
  };
  let result;
  if (win) {
    result = dialog.showMessageBoxSync(win, options);
  } else {
    result = dialog.showMessageBoxSync(options);
  }
  return result === 0;
};
