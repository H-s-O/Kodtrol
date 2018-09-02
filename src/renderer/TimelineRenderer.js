import { flatten, uniq, pick } from 'lodash';

import ScriptRenderer from './ScriptRenderer';
import TriggerRenderer from './TriggerRenderer';
import CurveRenderer from './CurveRenderer';

export default class TimelineRenderer {
  duration = null;
  inTime = null;
  outTime = null;
  currentTime = 0;
  blocks = null;
  triggers = null;
  curves = null;
  
  constructor(sourceTimeline, sourceScripts, sourceDevices) {
    const { inTime, outTime, duration } = sourceTimeline;
    
    this.inTime = inTime;
    this.outTime = outTime;
    this.duration = duration;
    
    // Extract timeline items
    const timelineItems = flatten(sourceTimeline.layers);
    const sourceScriptsById = sourceScripts.reduce((obj, script) => {
      return {
        ...obj,
        [script.id]: script,
      };
    }, {});
    
    this.blocks = timelineItems
      .filter((item) => 'script' in item)
      .map((block) => {
        return {
          ...block,
          instance: new ScriptRenderer(sourceScriptsById[block.script], sourceDevices),
        };
      });
    
    this.triggers = timelineItems
      .filter((item) => 'trigger' in item)
      .map((trigger) => {
        return {
          ...trigger,
          instance: new TriggerRenderer(),
        };
      });
      
    this.curves = timelineItems
      .filter((item) => 'curve' in item)
      .map((curve) => {
        return {
          ...curve,
          instance: new CurveRenderer(),
        };
      });
  }

  setPosition = (position) => {
    this.currentTime = position;
    this.resetBlocks();
    this.resetTriggers();
    this.resetCurves();
  }
  
  render = (delta) => {
    this.currentTime += delta;
    
    const currentTime = this.currentTime;
    if (currentTime > this.outTime) {
      // this.restartTimeline();
      // currentTime = 0;
      return {};
    }

    const triggerData = this.triggers
      .filter((trigger) => (
        currentTime >= trigger.inTime
        && currentTime <= trigger.inTime + 50
        && !trigger.instance.triggered)
      )
      .reduce((renderTriggerData, trigger) => {
        trigger.instance.render();

        return {
          ...renderTriggerData,
          [trigger.trigger]: true,
        };
      }, {});

    const curveData = this.curves
      .filter((curve) => (
        currentTime >= curve.inTime
        && currentTime <= curve.inTime + 50
        && !curve.instance.started)
      )
      .reduce((renderCurveData, curve) => {
        const data = curve.instance.render();

        return {
          ...renderCurveData,
          [curve.trigger]: true,
        };
      }, {});

    const blocksData = this.blocks
      .filter((block) => (
        currentTime >= block.inTime
        && currentTime <= block.outTime)
      )
      .reduce((renderDataObj, block) => {
        const { inTime, outTime } = block;
        const blockInfo = {
          inTime,
          outTime,
          currentTime,
          blockPercent: ((currentTime - inTime) / (outTime - inTime)),
        };
        
        const data = block.instance.render(currentTime, blockInfo, triggerData);
        
        return {
          dmx: {
            ...renderDataObj.dmx,
            ...data.dmx,
          },
        };
      }, {});

    return {
      ...blocksData,
      ...audiosData,
    };
  }

  beat = (beat, delta) => {
    const currentTime = this.currentTime + delta;
    
    this.blocks
      .filter((block) => (
        currentTime >= block.inTime
        && currentTime <= block.outTime)
      )
      .forEach((block) => {
        block.instance.beat(beat, currentTime);
      });
  }
  
  input = (type, data) => {
    // @TODO
  }

  restartTimeline = () => {
    this.positionTime = 0;
    this.resetBlocks();
    this.resetTriggers();
    this.resetCurves();
  }

  resetBlocks = () => {
    this.blocks.forEach((block) => block.instance.reset());
  }

  resetTriggers = () => {
    this.triggers.forEach((trigger) => trigger.instance.reset());
  }

  resetCurves = () => {
    this.curves.forEach((curve) => curve.instance.reset());
  }

  destroy = () => {
    this.blocks.forEach((block) => block.instance.destroy());

    this.blocks = null;
    this.triggers = null;
    this.curves = null;
  }
}
