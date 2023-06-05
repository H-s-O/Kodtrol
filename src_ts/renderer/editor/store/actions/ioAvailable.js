export const UPDATE_IO_LIST = 'update_io_available';
export const updateIOAvailableAction = (list) => {
  return {
    type: UPDATE_IO_LIST,
    payload: list,
  };
};
