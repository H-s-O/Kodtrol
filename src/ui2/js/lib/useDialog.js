import { useState, useCallback } from 'react';

import mergeDialogBody from '../../../common/js/lib/mergeDialogBody';

export default (initialState = { opened: false, mode: null, value: null }) => {
  const [state, setState] = useState(initialState);
  const { opened, mode, value } = state;

  const show = useCallback((mode, value = {}) => {
    setState({ ...state, opened: true, mode, value });
  }, [state]);
  const hide = useCallback(() => {
    setState({ ...state, opened: false, mode: null, value: null });
  }, [state]);
  const change = useCallback((newValue, field) => {
    setState({ ...state, value: mergeDialogBody(value, newValue, field) });
  }, [state]);

  return { opened, mode, value, show, hide, change };
}
