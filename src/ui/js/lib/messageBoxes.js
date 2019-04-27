import { remote } from 'electron';

import isFunction from './isFunction';

const { dialog } = remote;

export function deleteWarning(message, detail = null, callback) {
  // Handle two arguments call
  if (isFunction(detail)) {
    callback = detail;
    detail = null;
  }
  
  dialog.showMessageBox(remote.getCurrentWindow(), {
    type: 'warning',
    buttons: [
      'Delete', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message,
    detail,
  }, (response) => callback(response === 0));
};

export function importAudioFile() {
  return dialog.showOpenDialog({
    title: 'Import audio file',
    filters: [
      {
        name: 'Audio files',
        extensions: ['mp3', 'wav'],
      },
    ],
  });
}