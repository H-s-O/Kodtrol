import { validateAll } from './validatorHelpers';

export default ({ name }) => validateAll({
  name: !!name,
});
