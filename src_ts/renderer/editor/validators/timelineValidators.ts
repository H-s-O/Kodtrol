import { Timeline } from '../../../common/types';
import { validateAll } from './validatorHelpers';

export const timelineValidator = ({ name, duration }: Timeline) => validateAll({
  name: !!name,
  duration: duration > 0,
});

export const timelineCurveValidator = ({ layer, name, inTime, outTime }, maxTime: number) => validateAll({
  layer: !!layer,
  name: !!name,
  inTime: inTime >= 0 && inTime < outTime,
  outTime: outTime <= maxTime && outTime > inTime,
});

export const timelineMediaValidator = ({ media, layer, inTime, outTime, volume }, maxTime: number) => validateAll({
  media: !!media,
  layer: !!layer,
  inTime: inTime >= 0 && inTime < outTime,
  outTime: outTime <= maxTime && outTime > inTime,
  volume: volume >= 0 && volume <= 1,
});

export const timelineRecordedTriggersValidator = ({ triggers }) => validateAll({
  triggers: triggers.every(({ name, layer, hotkey }) => !!name && !!layer && !!hotkey),
});

export const timelineScriptValidator = ({ script, layer, inTime, outTime }, maxTime: number) => validateAll({
  layer: !!layer,
  script: !!script,
  inTime: inTime >= 0 && inTime < outTime,
  outTime: outTime <= maxTime && outTime > inTime,
});

export const timelineTriggerValidator = ({ layer, name, inTime }, maxTime: number) => validateAll({
  layer: !!layer,
  name: !!name,
  inTime: inTime >= 0 && inTime <= maxTime,
});
