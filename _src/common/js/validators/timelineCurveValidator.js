import { validateAll } from './validatorHelpers';

export default ({ layer, name, inTime, outTime }, maxTime) => validateAll({
  layer: !!layer,
  name: !!name,
  inTime: inTime >= 0 && inTime < outTime,
  outTime: outTime <= maxTime && outTime > inTime,
});
