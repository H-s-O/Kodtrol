import { Board } from '../../../common/types';
import { validateAll } from './validatorHelpers';

export const boardValidator = ({ name }: Board) => validateAll({
  name: !!name,
});

export const boardScriptValidator = ({ script, layer, behavior, trigger, triggerSource }) => validateAll({
  script: !!script,
  layer: !!layer,
  behavior: !!behavior,
  triggerSource: trigger ? !!triggerSource : true,
});
