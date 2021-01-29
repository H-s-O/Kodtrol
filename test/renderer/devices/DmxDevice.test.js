import { expect } from 'chai';

import DmxDevice from '../../../src/renderer/rendering/DmxDevice';

const providers = {
  getOutput: (id) => ({
    '7l9r6tf8vka35n1kk': { id: '7l9r6tf8vka35n1kk' },
    '7l9r6tf97ka35p445': { id: '7l9r6tf97ka35p445' },
  }[id]),
};

describe('DmxDevice', function () {
  const source1 = {
    id: '7l9r6tf75ka35d4ik',
    name: 'MyName1',
    hash: '07f41d37d92eb28cb7a10aad0f7c29fe',
    type: 'dmx',
    tags: [],
    address: 12,
  };
  const source2 = {
    ...source1,
    id: '7l9r6tfdjka36aomx',
    name: 'MyName2',
    hash: 'a424648556c3fa56be20bb84cd1d0453',
    tags: ['tag1'],
    address: 24,
    output: '7l9r6tf97ka35p445',
    channels: [
      { defaultValue: 0, alias: 'first' },
      { defaultValue: 127 },
      { defaultValue: 255, alias: 'third' },
    ],
  };
  let instance;

  it('should construct without using with initial data', function () {
    instance = new DmxDevice(providers, source1);
  });

  it('should have proper getter values', function () {
    expect(instance.id).to.equal(source1.id);
    expect(instance.name).to.equal(source1.name);
    expect(instance.type).to.equal(source1.type);
    expect(instance.hash).to.equal(source1.hash);
    expect(instance.address).to.equal(source1.address).and.be.a('number');
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
    expect(instance.address).to.equal(source2.address).and.be.a('number');
  });

  it('should have proper method results after update', function () {
    expect(instance.hasTag(source2.tags[0])).to.be.true;
    expect(instance.hasTag('nope')).to.be.false;
  });

  it('should set the proper numerical channel', function () {
    instance.setChannel(1, 42);
    expect(instance.channels['0']).to.equal(42);
  });

  it('should set the proper aliased channel', function () {
    instance.setChannel('third', 11);
    expect(instance.channels['2']).to.equal(11);
  });

  it('should get the proper numerical channel default', function () {
    expect(instance.getChannelDefault(1)).to.equal(source2.channels[0].defaultValue);
  });

  it('should get the proper aliased channel default', function () {
    expect(instance.getChannelDefault('first')).to.equal(source2.channels[0].defaultValue);
  });

  it('should destroy without errors', function () {
    instance.destroy();
  });
});
