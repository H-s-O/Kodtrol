import { expect } from 'chai';

import sequence, { sequenceReset } from '../../../src/main/lib/helpers/sequence';

describe('Helper - sequence', function () {
  const source1 = [1, 2, 3];
  const source2 = [1, 2];

  it('should return for null or empty array', function () {
    expect(sequence(null)).to.be.null;
    expect(sequence([])).to.be.null;
  });

  it('should init properly with default ID and return first item', function () {
    expect(sequence(source1)).to.equal(source1[0]);
  });

  it('should advance properly and rollover with default ID', function () {
    expect(sequence(source1)).to.equal(source1[1]);
    expect(sequence(source1)).to.equal(source1[2]);
    expect(sequence(source1)).to.equal(source1[0]);
    expect(sequence(source1)).to.equal(source1[1]);
  });

  it('should reset with default ID if the array is shorter than the current index', function () {
    expect(sequence(source2)).to.equal(source2[0]);
  });

  it('should reset properly with default ID', function () {
    sequence(source1);
    sequence(source1);
    expect(sequenceReset());
    expect(sequence(source1)).to.equal(source1[0])
  });

  it('should init properly with custom ID and return first item', function () {
    expect(sequence(source1, 'mySequence')).to.equal(source1[0]);
  });

  it('should advance properly and rollover with custom ID', function () {
    expect(sequence(source1, 'mySequence')).to.equal(source1[1]);
    expect(sequence(source1, 'mySequence')).to.equal(source1[2]);
    expect(sequence(source1, 'mySequence')).to.equal(source1[0]);
    expect(sequence(source1, 'mySequence')).to.equal(source1[1]);
  });

  it('should reset with custom ID if the array is shorter than the current index', function () {
    expect(sequence(source2, 'mySequence')).to.equal(source2[0]);
  });

  it('should reset properly with custom ID', function () {
    sequence(source1, 'mySequence');
    sequence(source1, 'mySequence');
    expect(sequenceReset('mySequence'));
    expect(sequence(source1, 'mySequence')).to.equal(source1[0])
  });
});
