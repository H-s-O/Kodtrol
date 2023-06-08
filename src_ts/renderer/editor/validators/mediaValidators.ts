import { Media } from '../../../common/types';
import { validateAll } from './validatorHelpers';

export const mediaValidator = ({ file, duration }: Media) => validateAll({
  file: !!file,
  duration: file ? duration > 0 : true,
});
