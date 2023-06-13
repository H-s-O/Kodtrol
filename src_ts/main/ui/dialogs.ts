import {
  BrowserWindow,
  MessageBoxOptions,
  OpenDialogOptions,
  SaveDialogOptions,
  dialog,
} from 'electron/main';

import { APP_NAME, PROJECT_FILE_EXTENSION } from '../../common/constants';
import { IS_WINDOWS } from '../constants';

export const createProjectDialog = async (win?: BrowserWindow | null) => {
  const options: SaveDialogOptions = {
    title: 'Create project',
  };
  if (win) {
    return (await dialog.showSaveDialog(win, options)).filePath;
  }
  return (await dialog.showSaveDialog(options)).filePath;
};

export const openProjectDialog = async (win?: BrowserWindow | null) => {
  const options: OpenDialogOptions = {
    title: 'Open project',
    filters: [
      {
        name: `${APP_NAME} files`,
        extensions: [PROJECT_FILE_EXTENSION],
      },
    ],
  };
  if (win) {
    const { filePaths } = await dialog.showOpenDialog(win, options);
    if (filePaths.length > 0) {
      return filePaths[0];
    }
    return undefined;
  }
  const { filePaths } = await dialog.showOpenDialog(options);
  if (filePaths.length > 0) {
    return filePaths[0];
  }
  return undefined;
};

export const warnBeforeClosingProject = async (win?: BrowserWindow | null) => {
  const options: MessageBoxOptions = {
    type: 'warning',
    buttons: [
      'Close', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message: 'Are you sure you want to close this project?',
  };
  if (win) {
    return (await dialog.showMessageBox(win, options)).response === 0;
  }
  return (await dialog.showMessageBox(options)).response === 0;
};

export const warnBeforeDeleting = async (message: string, detail?: string, win?: BrowserWindow | null) => {
  const options: MessageBoxOptions = {
    type: 'warning',
    buttons: [
      'Delete', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message,
    detail: IS_WINDOWS ? (detail ?? ' ') : detail,
  };
  if (win) {
    return (await dialog.showMessageBox(win, options)).response === 0;
  }
  return (await dialog.showMessageBox(options)).response === 0;
};

export const warnBeforeClosing = async (message: string, detail?: string, win?: BrowserWindow | null) => {
  const options: MessageBoxOptions = {
    type: 'warning',
    buttons: [
      'Close', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message,
    detail: IS_WINDOWS ? (detail ?? ' ') : detail,
  };
  if (win) {
    return (await dialog.showMessageBox(win, options)).response === 0;
  }
  return (await dialog.showMessageBox(options)).response === 0;
};
