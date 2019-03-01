import uniqid from 'uniqid';

export const updateInputs = (inputs) => ({
  type: 'UPDATE_INPUTS',
  payload: inputs,
});

export const createInput = (inputData) => ({
  type: 'CREATE_INPUT',
  payload: {
    ...inputData,
    id: uniqid(),
    lastUpdated: Date.now(),
  },
});

export const deleteInput = (id) => ({
  type: 'DELETE_INPUT',
  payload: id,
});

export const saveInput = (id, data) => ({
  type: 'SAVE_INPUT',
  payload: {
    id,
    data: {
      ...data,
      lastUpdated: Date.now(),
    },
  },
});