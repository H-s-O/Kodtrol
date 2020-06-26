import { expect } from 'chai';

import IldaDevice from '../../../src/renderer/rendering/IldaDevice';

const providers = {
  getOutput: (id) => ({
    '7l9r6tf8vka35n1kk': { id: '7l9r6tf8vka35n1kk' },
    '7l9r6tf97ka35p445': { id: '7l9r6tf97ka35p445' },
  }[id]),
};

describe('IldaDevice', function () {
  const source1 = {
    id: '7l9r6tf75ka35d4ik',
    name: 'MyName1',
    hash: '07f41d37d92eb28cb7a10aad0f7c29fe',
    type: 'ilda',
    tags: [],
    pps: 10000,
  };
  const source2 = {
    ...source1,
    id: '7l9r6tfdjka36aomx',
    name: 'MyName2',
    hash: 'a424648556c3fa56be20bb84cd1d0453',
    tags: ['tag1'],
    output: '7l9r6tf97ka35p445',
    pps: 20000,
  };
  let instance;

  it('should construct without errors using initial data', function () {
    instance = new IldaDevice(providers, source1);
  });

  it('should have proper getter values', function () {
    expect(instance.id).to.equal(source1.id);
    expect(instance.name).to.equal(source1.name);
    expect(instance.type).to.equal(source1.type);
    expect(instance.hash).to.equal(source1.hash);
    expect(instance.pointsPerSecond).to.equal(source1.pps).and.be.a('number');
  });

  it('should have proper method results', function () {
    expect(instance.isType(source1.type)).to.be.true;
    expect(instance.hasTag('nope')).to.be.false;
  });

  it('should update without errors', function () {
    instance.update(source2);
  });

  it('should have proper getter values after update', function () {
    expect(instance.id).to.equal(source2.id);
    expect(instance.name).to.equal(source2.name);
    expect(instance.type).to.equal(source2.type);
    expect(instance.hash).to.equal(source2.hash);
    expect(instance.pointsPerSecond).to.equal(source2.pps).and.be.a('number');
  });

  it('should have proper method results after update', function () {
    expect(instance.hasTag(source2.tags[0])).to.be.true;
    expect(instance.hasTag('nope')).to.be.false;
  });

  it('should destroy without errors', function () {
    instance.destroy();
  });
});
