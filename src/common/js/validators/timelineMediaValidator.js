import { validateAll } from './validatorHelpers';

export default ({ media, layer, inTime, outTime, volume }, maxTime) => validateAll({
  media: !!media,
  layer: !!layer,
  inTime: inTime >= 0 && inTime < outTime,
  outTime: outTime <= maxTime && outTime > inTime,
  volume: volume >= 0 && volume <= 1,
});
