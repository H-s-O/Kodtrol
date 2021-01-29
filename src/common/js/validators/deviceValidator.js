import { IO_DMX, IO_MIDI } from '../constants/io';
import { validateAll } from './validatorHelpers';

export default ({ name, type, address, channel }) => validateAll({
  name: !!name,
  type: !!type,
  address: type === IO_DMX ? address > 0 : true,
  channel: type === IO_MIDI ? channel > 0 : true,
});
