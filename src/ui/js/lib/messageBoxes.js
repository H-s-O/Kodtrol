import { remote } from 'electron';

const { dialog } = remote;

export function deleteWarning(message, detail = null, callback) {
  // Handle two arguments call
  if (typeof detail === 'function') {
    callback = detail;
    detail = null;
  }

  const response = dialog.showMessageBoxSync(remote.getCurrentWindow(), {
    type: 'warning',
    buttons: [
      'Delete', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message,
    detail: detail ? detail : undefined,
  });
  callback(response === 0)
};

export function closeWarning(message, detail = null, callback) {
  // Handle two arguments call
  if (typeof detail === 'function') {
    callback = detail;
    detail = null;
  }

  const response = dialog.showMessageBoxSync(remote.getCurrentWindow(), {
    type: 'warning',
    buttons: [
      'Close', 'Cancel',
    ],
    defaultId: 0,
    cancelId: 1,
    message,
    detail: detail ? detail : undefined,
  });
  callback(response === 0)
};
