import { IOType } from '../../../common/constants';
import { Input } from '../../../common/types';
import { validateAll } from './validatorHelpers';

export const inputValidator = ({ name, type, protocol, port, device }: Input) => validateAll({
  name: !!name,
  type: !!type,
  protocol: type === IOType.OSC ? !!protocol : true,
  port: type === IOType.OSC ? !!port : true,
  device: type === IOType.MIDI ? !!device : true,
});
