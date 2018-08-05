import { remote } from 'electron';

export function deleteWarning(message, callback) {
  const { dialog } = remote;
  
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
