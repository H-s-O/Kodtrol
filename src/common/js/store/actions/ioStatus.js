export const updateIOStatus = (status) => {
  return {
    type: 'UPDATE_IO_STATUS',
    payload: status,
  };
};