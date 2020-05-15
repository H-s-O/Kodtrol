import { expect } from 'chai';

import clamp from '../../src/main/lib/helpers/clamp';
import isEven from '../../src/main/lib/helpers/isEven';
import isOdd from '../../src/main/lib/helpers/isOdd';

describe('Script helpers', function () {
  describe('clamp', function () {
    it('should pass value within range', function () {
      expect(clamp(5, 1, 10)).to.equal(5);
    });

    it('should clamp values outside of range', function () {
      expect(clamp(0, 1, 10)).to.equal(1);
      expect(clamp(100, 1, 10)).to.equal(10);
    });
  });

  describe('isEven', function () {
    it('should return true for even numbers', function () {
      expect(isEven(2)).to.be.true;
    });

    it('should return false for odd numbers', function () {
      expect(isEven(3)).to.be.false;
      expect(isEven(2.1)).to.be.false;
    });
  });

  describe('isOdd', function () {
    it('should return true for odd numbers', function () {
      expect(isOdd(3)).to.be.true;
      expect(isOdd(3.1)).to.be.true;
    });
    
    it('should return false for even numbers', function () {
      expect(isOdd(2)).to.be.false;
    });
  });
});
