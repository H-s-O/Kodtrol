import { hashDataObject } from '../../../../common/utils';

const EXCLUDE_HASH_PROPS = [
  'id',
  'name',
] as const;

export const UPDATE_OUTPUTS = 'update_outputs';
export const updateOutputsAction = (outputs) => {
  return {
    type: UPDATE_OUTPUTS,
    payload: outputs,
  };
};

export const SAVE_OUTPUTS = 'save_outputs';
export const saveOutputsAction = (data) => {
  return {
    type: SAVE_OUTPUTS,
    payload: data.map((output) => {
      return {
        ...output,
        hash: hashDataObject(output, EXCLUDE_HASH_PROPS),
      }
    }),
  };
};
