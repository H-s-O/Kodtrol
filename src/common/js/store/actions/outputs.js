import uniqid from 'uniqid';

export const updateOutputs = (outputs) => ({
  type: 'UPDATE_OUTPUTS',
  payload: outputs,
});

export const createOutput = (outputData) => ({
  type: 'CREATE_OUTPUT',
  payload: {
    ...outputData,
    id: uniqid(),
    lastUpdated: Date.now(),
  },
});

export const deleteOutput = (id) => ({
  type: 'DELETE_OUTPUT',
  payload: id,
});

export const saveOutput = (id, data) => ({
  type: 'SAVE_OUTPUT',
  payload: {
    id,
    data: {
      ...data,
      lastUpdated: Date.now(),
    },
  },
});

export const saveOutputs = (data) => ({
  type: 'SAVE_OUTPUTS',
  payload: data.map((output) => {
    return {
      ...output,
      lastUpdated: Date.now(),
    }
  }),
});