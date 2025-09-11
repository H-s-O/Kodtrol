import { IO_DMX, IO_ILDA, IO_ARTNET } from '../constants/io';
import { validateAll } from './validatorHelpers';

export default ({ name, type, driver, port, address, dacRate, universe }) => validateAll({
  name: !!name,
  type: !!type,
  driver: type === IO_DMX || type === IO_ILDA ? !!driver : true,
  port: type === IO_DMX ? !!port : true,
  address: type === IO_ARTNET ? !!address : true,
  universe: type === IO_ARTNET ? !!universe : true,
  dacRate: type === IO_ILDA ? !!dacRate : true,
});
