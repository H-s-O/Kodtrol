import { dialog } from 'electron';

import { PROJECT_FILE_EXTENSION, APP_NAME } from '../../common/js/constants/app';

export const createProjectDialog = () => {
  const result = dialog.showSaveDialogSync({
    title: 'Create project',
  });
  return result || null;
};

export const openProjectDialog = () => {
  const result = dialog.showOpenDialogSync({
    title: 'Open project',
    filters: [
      {
        name: `${APP_NAME} files`,
        extensions: [PROJECT_FILE_EXTENSION],
      },
    ],
  });
  return result && result.length ? result[0] : null;
};

export const warnBeforeClosingProject = (win) => {
  const result = dialog.showMessageBoxSync(win, {
    type: 'warning',
    buttons: [
      'Close', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message: 'Are you sure you want to close this project?',
  });
  return result === 0;
};
