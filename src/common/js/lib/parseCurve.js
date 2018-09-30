import { sortBy } from 'lodash';

export default (curve) => {
  return sortBy(curve, ['x']);
}