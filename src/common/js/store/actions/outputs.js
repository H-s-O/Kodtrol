import uniqid from 'uniqid';

import { hashDataObject } from '../../lib/hash';

export const updateOutputs = (outputs) => {
  return {
    type: 'UPDATE_OUTPUTS',
    payload: outputs,
  };
};

export const saveOutputs = (data) => {
  return {
    type: 'SAVE_OUTPUTS',
    payload: data.map((output) => {
      return {
        ...output,
        hash: hashDataObject(output),
      }
    }),
  };
};