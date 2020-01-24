import { DIALOG_DUPLICATE, DIALOG_EDIT, DIALOG_ADD } from '../../../common/js/constants/dialogs';

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
