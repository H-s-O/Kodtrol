import { expect } from 'chai';

import isEven from '../../../src/main/lib/helpers/isEven';

describe('Helper - isEven', function () {
  it('should return true for even numbers', function () {
    expect(isEven(2)).to.be.true;
  });

  it('should return false for odd numbers', function () {
    expect(isEven(3)).to.be.false;
    expect(isEven(2.1)).to.be.false;
  });
});
