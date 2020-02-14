import { hashDataObject } from '../../lib/hash';

const excludeHashProps = [
  'id',
  'name',
];

export const UPDATE_INPUTS = 'update_inputs';
export const updateInputsAction = (inputs) => {
  return {
    type: UPDATE_INPUTS,
    payload: inputs,
  };
};

export const SAVE_INPUTS = 'save_inputs';
export const saveInputsAction = (data) => {
  return {
    type: SAVE_INPUTS,
    payload: data.map((input) => {
      return {
        ...input,
        hash: hashDataObject(input, excludeHashProps),
      }
    }),
  };
};
