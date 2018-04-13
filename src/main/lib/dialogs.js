import { dialog } from 'electron';

export const createProjectDialog = () => {
  return dialog.showSaveDialog({
    title: 'Create project',
  });
};
