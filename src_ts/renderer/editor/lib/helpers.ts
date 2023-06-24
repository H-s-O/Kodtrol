import { Howl } from 'howler';

import { KodtrolDialogType } from '../constants';
import { Media } from '../../../common/types';

export const percentString = (percent: number, space: boolean = false): string =>
  `${percent * 100}${space ? ' ' : ''}%`;

export const blockPercentToOpacity = (percent: number): number => {
  if (percent < 0) {
    return percent + 1;
  } else if (percent > 1) {
    return 1 - (percent - 1);
  } else {
    return percent;
  }
};

export const getDialogTitle = (mode: KodtrolDialogType, label: string): string => {
  switch (mode) {
    case KodtrolDialogType.DUPLICATE:
      return `Duplicate ${label}`;
      break;
    case KodtrolDialogType.CONFIGURE:
      return `Configure ${label}`;
      break;
    case KodtrolDialogType.EDIT:
      return `Edit ${label}`;
      break;
    case KodtrolDialogType.ADD:
    default:
      return `Add ${label}`;
      break;
  }
};

export const getSuccessButtonLabel = (mode: KodtrolDialogType): string => {
  switch (mode) {
    case KodtrolDialogType.DUPLICATE:
      return 'Duplicate';
      break;
    case KodtrolDialogType.CONFIGURE:
    case KodtrolDialogType.EDIT:
      return 'Save';
      break;
    case KodtrolDialogType.ADD:
    default:
      return 'Add';
      break;
  }
};

export const mergeDialogBody = (currentValue, newValue, name) => {
  if (typeof newValue === 'object' && typeof name === 'undefined') {
    return { ...currentValue, ...newValue };
  }
  return { ...currentValue, [name]: newValue };
};

export const mediaInfo = (filePath: string) => new Promise<{ duration: number }>((resolve, reject) => {
  const h = new Howl({
    src: filePath,
    preload: 'metadata',
    html5: true,
    onload: () => {
      const duration = h.duration() * 1000;
      resolve({ duration })
      h.unload();
    },
    onloaderror: (id, err) => {
      reject(err);
      h.unload();
    }
  });
});

export const getScriptName = ({ name, script }, scriptsNames): string => {
  return name || scriptsNames[script] || '[no name]';
};

export const getMediaName = ({ name, file }: Media): string => {
  return name || window.kodtrol_editor.path.basename(file) || '[no name]';
};
