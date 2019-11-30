import { remote } from 'electron';

import isFunction from './isFunction';
import { PROJECT_FILE_EXTENSION } from '../../../common/js/constants/app';

const { dialog } = remote;

export function deleteWarning(message, detail = undefined, callback) {
  // Handle two arguments call
  if (isFunction(detail)) {
    callback = detail;
    detail = undefined;
  }

  const response = dialog.showMessageBoxSync(remote.getCurrentWindow(), {
    type: 'warning',
    buttons: [
      'Delete', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message,
    detail,
  });
  callback(response === 0)
};

export function importAudioFile() {
  return dialog.showOpenDialogSync({
    title: 'Import audio file',
    filters: [
      {
        name: 'Audio files',
        extensions: ['mp3', 'wav'],
      },
    ],
  });
}

export function importProject() {
  return dialog.showOpenDialogSync({
    title: 'Import project',
    filters: [
      {
        name: 'Kodtrol project files',
        extensions: [PROJECT_FILE_EXTENSION],
      },
    ],
  });
}