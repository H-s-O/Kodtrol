import { expect } from 'chai';

import RootTimelineRenderer from '../../../src/renderer/rendering/renderers/root/RootTimelineRenderer'

const providers = {
  getTimeline: (id) => ({
    '7l9r6t177fkb00ftmx': {
      id: '7l9r6t177fkb00ftmx',
      name: 'MyName1',
      duration: 30000,
      inTime: 0,
      outTime: 30000,
      tempo: 120,
    },
  }[id]),
}
describe('RootTimelineRenderer', function () {
  let instance;

  it('should construct without errors using initial data', function () {
    instance = new RootTimelineRenderer(providers, '7l9r6t177fkb00ftmx')
  });

  it('should destroy without errors', function () {
    instance.destroy();
  });
});
