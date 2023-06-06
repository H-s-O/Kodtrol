import { validateAll } from './validatorHelpers';

export default ({ script, layer, inTime, outTime }, maxTime) => validateAll({
  layer: !!layer,
  script: !!script,
  inTime: inTime >= 0 && inTime < outTime,
  outTime: outTime <= maxTime && outTime > inTime,
});
