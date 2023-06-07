import { AnyAction } from 'redux';

import { LastEditorState } from '../../../../common/types';

export default (state: LastEditorState = null, { type, payload }: AnyAction): LastEditorState => {
  return state;
};
