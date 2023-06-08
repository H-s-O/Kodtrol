import { Script } from '../../../common/types';
import { validateAll } from './validatorHelpers';

export const scriptValidator = ({ name, devices }: Script) => validateAll({
  name: !!name,
  devices: devices.every(({ device }) => !!device),
});
