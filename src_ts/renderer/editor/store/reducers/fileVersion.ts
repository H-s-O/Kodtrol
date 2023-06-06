/// <reference path="../../editor-preload.d.ts" />

import { AnyAction } from 'redux';

import { FileVersionState } from '../../../../common/types';

export default (state: FileVersionState = window.kodtrol_editor.APP_VERSION, { type, payload }: AnyAction): FileVersionState => {
  switch (type) {
    default:
      return state;
      break;
  }
};
