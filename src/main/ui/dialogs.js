import { dialog } from 'electron';

export const createProjectDialog = () => {
  const result = dialog.showSaveDialog({
    title: 'Create project',
  });
  return result || null;
};

export const openProjectDialog = () => {
  const result = dialog.showOpenDialog({
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
  const result = dialog.showMessageBox(win, {
    type: 'warning',
    buttons: [
      'Close', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message: 'You will lose changes in the current project.',
  });
  return result === 0;
};
