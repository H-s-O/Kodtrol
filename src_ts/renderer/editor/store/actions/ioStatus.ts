export const UPDATE_IO_STATUS = 'update_io_status';
export const updateIOStatusAction = (status) => {
  return {
    type: UPDATE_IO_STATUS,
    payload: status,
  };
};
