import { dialog } from 'electron';

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
        name: 'Manuscript files',
        extensions: ['manuscrit'],
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
