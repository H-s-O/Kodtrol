import { remote } from 'electron';

import { DIALOG_DUPLICATE, DIALOG_EDIT, DIALOG_ADD } from '../../../common/js/constants/dialogs';
import { PROJECT_FILE_EXTENSION } from '../../../common/js/constants/app';

const { dialog } = remote;

export const getDialogTitle = (mode, label) => {
  switch (mode) {
    case DIALOG_DUPLICATE:
      return `Duplicate ${label}`;
      break;
    case DIALOG_EDIT:
      return `Save ${label}`;
      break;
    case DIALOG_ADD:
    default:
      return `Add ${label}`;
      break;
  }
}

export const getSuccessButtonLabel = (mode) => {
  switch (mode) {
    case DIALOG_DUPLICATE:
      return 'Duplicate';
      break;
    case DIALOG_EDIT:
      return 'Save';
      break;
    case DIALOG_ADD:
    default:
      return 'Add';
      break;
  }
}

export const deleteWarning = (message, detail = null) => {
  // Handle two arguments call
  if (typeof detail === 'function') {
    callback = detail;
    detail = null;
  }

  return dialog
    .showMessageBox({
      type: 'warning',
      buttons: [
        'Delete', 'Cancel',
      ],
      defaultId: 0,
      cancelId: 1,
      message,
      detail: detail ? detail : undefined,
    })
    .then(({ response }) => response === 0);
};

// export function importAudioFile() {
//   return dialog.showOpenDialogSync({
//     title: 'Import audio file',
//     filters: [
//       {
//         name: 'Audio files',
//         extensions: ['mp3', 'wav'],
//       },
//     ],
//   });
// }

// export function importProject() {
//   return dialog.showOpenDialogSync({
//     title: 'Import project',
//     filters: [
//       {
//         name: 'Kodtrol project files',
//         extensions: [PROJECT_FILE_EXTENSION],
//       },
//     ],
//   });
// }
