import { remote } from 'electron';

const { dialog } = remote;

export function deleteWarning(message, callback) {
  dialog.showMessageBox(remote.getCurrentWindow(), {
    type: 'warning',
    buttons: [
      'Delete', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message,
  }, (response) => callback(response === 0));
};

export function importAudioFile(callback) {
  return dialog.showOpenDialog({
    title: 'Import audio file',
    filters: [
      {
        name: 'Audio files',
        extensions: ['mp3', 'wav'],
      },
    ],
  }, (files) => callback(files[0]));
}