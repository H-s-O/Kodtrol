import { IOType } from '../../../common/constants';
import { Device } from '../../../common/types';
import { validateAll } from './validatorHelpers';

export const deviceValidator = ({ name, type, address, channel }: Device) => validateAll({
  name: !!name,
  type: !!type,
  address: type === IOType.DMX ? address > 0 : true,
  channel: type === IOType.MIDI ? channel > 0 : true,
});
