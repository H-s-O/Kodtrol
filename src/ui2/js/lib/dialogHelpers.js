import { DIALOG_DUPLICATE, DIALOG_EDIT, DIALOG_ADD, DIALOG_CONFIGURE } from '../../../common/js/constants/dialogs';

export const getDialogTitle = (mode, label) => {
  switch (mode) {
    case DIALOG_DUPLICATE:
      return `Duplicate ${label}`;
      break;
    case DIALOG_CONFIGURE:
      return `Configure ${label}`;
      break;
    case DIALOG_EDIT:
      return `Edit ${label}`;
      break;
    case DIALOG_ADD:
    default:
      return `Add ${label}`;
      break;
  }
};

export const getSuccessButtonLabel = (mode) => {
  switch (mode) {
    case DIALOG_DUPLICATE:
      return 'Duplicate';
      break;
    case DIALOG_CONFIGURE:
    case DIALOG_EDIT:
      return 'Save';
      break;
    case DIALOG_ADD:
    default:
      return 'Add';
      break;
  }
};
