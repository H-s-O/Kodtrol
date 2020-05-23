import { expect } from 'chai';

import clamp from '../../../src/main/lib/helpers/clamp';

describe('Helper - clamp', function () {
  it('should pass value within range', function () {
    expect(clamp(5, 1, 10)).to.equal(5);
  });

  it('should clamp values outside of range', function () {
    expect(clamp(0, 1, 10)).to.equal(1);
    expect(clamp(100, 1, 10)).to.equal(10);
  });
});
