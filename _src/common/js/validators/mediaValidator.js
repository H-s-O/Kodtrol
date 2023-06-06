import { validateAll } from './validatorHelpers';

export default ({ file, duration }) => validateAll({
  file: !!file,
  duration: file ? duration > 0 : true,
});
