import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';

import { KodtrolState } from '../../../common/types';
import { DispatchFunc } from '../EditorRoot';
import { KodtrolDialogType } from '../constants';

export const useKodtrolDispatch: DispatchFunc = useDispatch;
export const useKodtrolSelector: TypedUseSelectorHook<KodtrolState> = useSelector;

export const useDialog = (initialState = { opened: false, mode: null, value: null }) => {
  const [state, setState] = useState(initialState);
  const { opened, mode, value } = state;

  const show = useCallback((mode = KodtrolDialogType.ADD, value = null) => {
    setState({ ...state, opened: true, mode, value });
  }, [state]);
  const hide = useCallback(() => {
    setState({ ...state, opened: false, mode: null, value: null });
  }, [state]);
  const change = useCallback((newValue) => {
    setState({ ...state, value: newValue });
  }, [state]);

  return { opened, mode, value, show, hide, change };
};
