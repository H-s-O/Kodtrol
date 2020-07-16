import { IO_OSC, IO_MIDI } from '../constants/io';

export default ({ name, type, protocol, port, device }) => {
  if (!name || !type) {
    return false;
  }
  if (type === IO_OSC && (!protocol || !port)) {
    return false;
  }
  if (type === IO_MIDI && !device) {
    return false;
  }
  return true;
};
