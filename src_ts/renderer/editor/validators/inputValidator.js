import { IO_OSC, IO_MIDI } from '../constants/io';
import { validateAll } from './validatorHelpers';

export default ({ name, type, protocol, port, device }) => validateAll({
  name: !!name,
  type: !!type,
  protocol: type === IO_OSC ? !!protocol : true,
  port: type === IO_OSC ? !!port : true,
  device: type === IO_MIDI ? !!device : true,
});
