import { ImportDialogValue } from '../../../common/types';
import { KodtrolDialogType } from '../constants';
import { validateAll } from './validatorHelpers';

export const importValidator = (
  { devices, scripts, medias, timelines, boards }: ImportDialogValue,
  mode: KodtrolDialogType
) => validateAll({
  devices: mode === KodtrolDialogType.IMPORT_DEVICES ? !!devices && devices.length > 0 : true,
  scripts: mode === KodtrolDialogType.IMPORT_SCRIPTS ? !!scripts && scripts.length > 0 : true,
  medias: mode === KodtrolDialogType.IMPORT_MEDIAS ? !!medias && medias.length > 0 : true,
  timelines: mode === KodtrolDialogType.IMPORT_TIMELINES ? !!timelines && timelines.length > 0 : true,
  boards: mode === KodtrolDialogType.IMPORT_BOARDS ? !!boards && boards.length > 0 : true,
});
