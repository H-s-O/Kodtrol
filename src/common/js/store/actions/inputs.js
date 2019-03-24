import { hashDataObject } from '../../lib/hash';

export const updateInputs = (inputs) => {
  return {
    type: 'UPDATE_INPUTS',
    payload: inputs,
  };
};

export const saveInputs = (data) => {
  return {
    type: 'SAVE_INPUTS',
    payload: data.map((input) => {
      return {
        ...input,
        hash: hashDataObject(input),
      }
    }),
  };
};