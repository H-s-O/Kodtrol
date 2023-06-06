/// <reference path="../../editor-preload.d.ts" />

import { AnyAction } from 'redux';

type FileVersionState = string;

const defaultState: FileVersionState = window.kodtrol_editor.appVersion;

export default (state = defaultState, { type, payload }: AnyAction) => {
  switch (type) {
    default:
      return state;
      break;
  }
};
