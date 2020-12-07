import { DIALOG_IMPORT_BOARDS, DIALOG_IMPORT_DEVICES, DIALOG_IMPORT_MEDIAS, DIALOG_IMPORT_SCRIPTS, DIALOG_IMPORT_TIMELINES } from '../constants/dialogs';
import { validateAll } from './validatorHelpers';

export default ({ devices, scripts, medias, timelines, boards }, mode) => validateAll({
  devices: mode === DIALOG_IMPORT_DEVICES ? !!devices && devices.length > 0 : true,
  scripts: mode === DIALOG_IMPORT_SCRIPTS ? !!scripts && scripts.length > 0 : true,
  medias: mode === DIALOG_IMPORT_MEDIAS ? !!medias && medias.length > 0 : true,
  timelines: mode === DIALOG_IMPORT_TIMELINES ? !!timelines && timelines.length > 0 : true,
  boards: mode === DIALOG_IMPORT_BOARDS ? !!boards && boards.length > 0 : true,
});
