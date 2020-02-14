import { IO_DMX, IO_ILDA, IO_ARTNET } from '../constants/io';

export default ({ name, type, driver, port, address }) => {
  if (!name || !type) {
    return false;
  }
  if (type === IO_DMX && (!driver || !port)) {
    return false;
  }
  if (type === IO_ARTNET && !address) {
    return false;
  }
  if (type === IO_ILDA && !address) {
    return false;
  }
  return true;
};
