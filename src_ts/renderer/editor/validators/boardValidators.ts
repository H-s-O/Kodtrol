import { Board } from '../../../common/types';
import { validateAll } from './validatorHelpers';

export const boardValidator = ({ name }: Board) => validateAll({
  name: !!name,
});
