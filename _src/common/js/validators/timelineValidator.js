import { validateAll } from './validatorHelpers';

export default ({ name, duration }) => validateAll({
  name: !!name,
  duration: duration > 0,
});
