import { expect } from 'chai';

import counter, { counterReset, counterResetAll } from '../../../src/main/lib/helpers/counter';

describe('Helper - counter', function () {
  it('should init properly with default ID and return 0', function () {
    expect(counter()).to.equal(0);
  });

  it('should increment properly with default ID', function () {
    expect(counter()).to.equal(1);
    expect(counter()).to.equal(2);
  });

  it('should reset with default ID to 0', function () {
    counterReset();
    expect(counter()).to.equal(0);
  });

  it('should init properly with custom ID and return 0', function () {
    expect(counter('myCounter')).to.equal(0);
  });

  it('should increment properly with custom ID', function () {
    expect(counter('myCounter')).to.equal(1);
    expect(counter('myCounter')).to.equal(2);
  });

  it('should reset with custom ID to 0', function () {
    counterReset('myCounter');
    expect(counter('myCounter')).to.equal(0);
  });

  it('should reset all', function () {
    counter();
    counter('myCounter');
    counterResetAll();
    expect(counter()).to.equal(0);
    expect(counter('myCounter')).to.equal(0);
  });
});
