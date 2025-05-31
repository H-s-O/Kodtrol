import { validateAll } from './validatorHelpers';

export default ({ script, layer, behavior, trigger, leadInTime, leadOutTime, switchMode, triggerSource }) => validateAll({
  script: !!script,
  layer: !!layer,
  behavior: !!behavior,
  triggerSource: trigger ? !!triggerSource : true,
  switchMode: !!leadInTime && !!leadOutTime ? !!switchMode : true,
})
