import { sortBy } from 'lodash';

export default (curve) => {
  const sorted = sortBy(curve, ['x']);
  if (!sorted.length) {
    return sorted;
  }
  const first = sorted[0];
  if (first.x !== 0) {
    sorted.unshift({
      ...first,
      x: 0,
      extra: true,
    });
  }
  const last = sorted[sorted.length - 1];
  if (last.x !== 1) {
    sorted.push({
      ...last,
      x: 1,
      extra: true,
    });
  }
  return sorted;
}