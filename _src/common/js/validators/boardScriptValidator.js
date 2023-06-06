import { validateAll } from './validatorHelpers';

export default ({ script, layer, behavior, trigger, triggerSource }) => validateAll({
  script: !!script,
  layer: !!layer,
  behavior: !!behavior,
  triggerSource: trigger ? !!triggerSource : true,
})
