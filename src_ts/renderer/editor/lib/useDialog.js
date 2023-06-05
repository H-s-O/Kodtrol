import { useState, useCallback } from 'react';

import { DIALOG_ADD } from '../../../common/js/constants/dialogs';

export default (initialState = { opened: false, mode: null, value: null }) => {
  const [state, setState] = useState(initialState);
  const { opened, mode, value } = state;

  const show = useCallback((mode = DIALOG_ADD, value = null) => {
    setState({ ...state, opened: true, mode, value });
  }, [state]);
  const hide = useCallback(() => {
    setState({ ...state, opened: false, mode: null, value: null });
  }, [state]);
  const change = useCallback((newValue) => {
    setState({ ...state, value: newValue });
  }, [state]);

  return { opened, mode, value, show, hide, change };
}
