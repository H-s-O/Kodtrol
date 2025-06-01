import Timeline from '../../../src/renderer/rendering/Timeline';
import RootTimelineRenderer from '../../../src/renderer/rendering/renderers/root/RootTimelineRenderer';

const MOCK_DATA = {
  '7l9r6t177fkb00ftmx': new Timeline({
    id: '7l9r6t177fkb00ftmx',
    name: 'MyName1',
    duration: 30000,
    inTime: 0,
    outTime: 30000,
    tempo: 120,
    layers: [],
    items: [],
  }),
};

const MOCK_PROVIDERS = {
  getTimeline: (id) => MOCK_DATA[id],
};

describe('RootTimelineRenderer', function () {
  let instance;

  it('should construct without errors using initial data', function () {
    instance = new RootTimelineRenderer(MOCK_PROVIDERS, '7l9r6t177fkb00ftmx')
  });

  it('should destroy without errors', function () {
    instance.destroy();
  });
});
