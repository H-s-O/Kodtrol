import { expect } from 'chai';

import isOdd from '../../../src/main/lib/helpers/isOdd';

describe('Helper - isOdd', function () {
  it('should return true for odd numbers', function () {
    expect(isOdd(3)).to.be.true;
    expect(isOdd(3.1)).to.be.true;
  });

  it('should return false for even numbers', function () {
    expect(isOdd(2)).to.be.false;
  });
});
