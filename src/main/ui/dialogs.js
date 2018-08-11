import { dialog } from 'electron';

export const createProjectDialog = () => {
  return dialog.showSaveDialog({
    title: 'Create project',
  });
};

export const openProjectDialog = () => {
  return dialog.showOpenDialog({
    title: 'Open project',
    filters: [
      {
        name: 'Manuscript files',
        extensions: ['manuscrit'],
      },
    ],
  })[0];
};

export const warnBeforeClosingProject = (win) => {
  return 0 === dialog.showMessageBox(win, {
    type: 'warning',
    buttons: [
      'Close', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message: 'You will lose changes in the current project.',
  });
};
