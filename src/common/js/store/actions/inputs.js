import uniqid from 'uniqid';

import hash from '../../lib/hash';

export const updateInputs = (inputs) => ({
  type: 'UPDATE_INPUTS',
  payload: inputs,
});

export const createInput = (inputData) => ({
  type: 'CREATE_INPUT',
  payload: {
    ...inputData,
    id: uniqid(),
    hash: hash(inputData),
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
      hash: hash(data),
    },
  },
});

export const saveInputs = (data) => ({
  type: 'SAVE_INPUTS',
  payload: data.map((input) => {
    return {
      ...input,
      hash: hash(input),
    }
  }),
});