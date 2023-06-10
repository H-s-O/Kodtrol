import { IOType } from '../../../common/constants';
import { Output } from '../../../common/types';
import { validateAll } from './validatorHelpers';

export const outputValidator = ({ name, type, driver, port, address, dacRate }: Output) => validateAll({
  name: !!name,
  type: !!type,
  driver: type === IOType.DMX || type === IOType.ILDA ? !!driver : true,
  port: type === IOType.DMX ? !!port : true,
  address: type === IOType.ARTNET ? !!address : true,
  dacRate: type === IOType.ILDA ? !!dacRate : true,
});
