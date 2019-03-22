import uniqid from 'uniqid';

import hash from '../../lib/hash';

export const updateOutputs = (outputs) => ({
  type: 'UPDATE_OUTPUTS',
  payload: outputs,
});

export const createOutput = (outputData) => ({
  type: 'CREATE_OUTPUT',
  payload: {
    ...outputData,
    id: uniqid(),
    hash: hash(outputData),
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
      hash: hash(data),
    },
  },
});

export const saveOutputs = (data) => ({
  type: 'SAVE_OUTPUTS',
  payload: data.map((output) => {
    return {
      ...output,
      hash: hash(output),
    }
  }),
});