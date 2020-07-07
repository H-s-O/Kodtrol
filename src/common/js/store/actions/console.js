export const SET_CONSOLE_OPENED = 'set_console_opened'
export const setConsoleOpenedAction = () => {
  return {
    type: SET_CONSOLE_OPENED,
  };
};

export const SET_CONSOLE_CLOSED = 'set_console_closed'
export const setConsoleClosedAction = () => {
  return {
    type: SET_CONSOLE_CLOSED,
  };
};

export const TOGGLE_CONSOLE = 'toggle_console'
export const toggleConsoleAction = () => {
  return {
    type: TOGGLE_CONSOLE,
  };
};
