import { validateAll } from './validatorHelpers';

export default ({ name, devices }) => validateAll({
  name: !!name,
  devices: devices.every(({ device }) => !!device),
});
