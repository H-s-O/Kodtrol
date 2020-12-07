import { validateAll } from './validatorHelpers';

export default ({ layer, name, inTime }, maxTime) => validateAll({
  layer: !!layer,
  name: !!name,
  inTime: inTime >= 0 && inTime <= maxTime,
});
