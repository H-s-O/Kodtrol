import { hashDataObject } from '../../../../common/utils';

const EXCLUDE_HASH_PROPS = [
  'id',
  'name',
] as const;

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
        hash: hashDataObject(input, EXCLUDE_HASH_PROPS),
      }
    }),
  };
};
