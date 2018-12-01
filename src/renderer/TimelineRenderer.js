import { flatten, uniq, pick } from 'lodash';

import ScriptRenderer from './ScriptRenderer';
import TriggerRenderer from './TriggerRenderer';
import CurveRenderer from './CurveRenderer';
import AudioRenderer from './AudioRenderer';

export default class TimelineRenderer {
  duration = null;
  inTime = null;
  outTime = null;
  currentTime = 0;
  blocks = null;
  triggers = null;
  curves = null;
  
  constructor(sourceTimeline, sourceScripts, sourceDevices) {
    const { inTime, outTime, duration, layers, items } = sourceTimeline;
    
    this.inTime = inTime;
    this.outTime = outTime;
    this.duration = duration;
    
    // "Prepare" data
    const sourceScriptsById = sourceScripts.reduce((obj, script) => {
      return {
        ...obj,
        [script.id]: script,
      };
    }, {});
    const layersById = layers.reduce((obj, layer) => {
      return {
        ...obj,
        [layer.id]: layer,
      }
    }, {});
    
    // Extract timeline items
    const timelineItems = items.sort((a, b) => {
      return layersById[a.layer].order - layersById[b.layer].order;
    });
    
    this.blocks = timelineItems
      .filter((item) => 'script' in item)
      .map((block) => {
        return {
          ...block,
          instance: new ScriptRenderer(sourceScriptsById[block.script], sourceDevices),
        };
      });
      
    this.audios = timelineItems
      .filter((item) => 'file' in item)
      .map((audio) => {
        return {
          ...audio,
          instance: new AudioRenderer(audio),
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
          instance: new CurveRenderer(curve),
        };
      });
  }

  setPosition = (position) => {
    this.currentTime = position;
    this.resetBlocks();
    this.resetTriggers();
    this.resetCurves();
    this.resetAudios()
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
        && currentTime <= trigger.inTime + 30
        && !trigger.instance.triggered
      ))
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
        && currentTime <= curve.outTime
      ))
      .reduce((renderCurveData, curve) => {
        const { inTime, outTime } = curve;
        const curveInfo = {
          inTime,
          outTime,
          currentTime,
          curvePercent: ((currentTime - inTime) / (outTime - inTime)),
        };
        
        const data = curve.instance.render(currentTime, curveInfo);

        return {
          ...renderCurveData,
          [curve.name]: data,
        };
      }, {});

    const blocksData = this.blocks
      .filter((block) => (
        currentTime >= block.inTime - 500 // @TODO config script setup delay
        && currentTime <= block.outTime
      ))
      .reduce((renderDataObj, block) => {
        const { inTime, outTime } = block;
        const blockInfo = {
          inTime,
          outTime,
          currentTime,
          blockPercent: ((currentTime - inTime) / (outTime - inTime)),
        };
        
        const data = block.instance.render(currentTime, blockInfo, triggerData, curveData);
        
        return {
          dmx: {
            ...renderDataObj.dmx,
            ...data.dmx,
          },
        };
      }, {});
    
    const audiosData = this.audios
      .filter((audio) => (
        currentTime >= audio.inTime
        && currentTime <= audio.outTime
      ))
      .reduce((renderDataObj, audio) => {
        const { id, inTime, outTime } = audio;
        const audioInfo = {
          inTime,
          outTime,
          currentTime,
          audioPercent: ((currentTime - inTime) / (outTime - inTime)),
        };
        
        const data = audio.instance.render(currentTime, audioInfo);
        
        return {
          audio: {
            ...renderDataObj.audio,
            ...data.audio,
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
    console.log(delta);
    this.blocks
      .filter((block) => (
        currentTime >= block.inTime
        && currentTime <= block.outTime
      ))
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

  resetAudios = () => {
    this.audios.forEach((audio) => audio.instance.reset());
  }

  destroy = () => {
    this.blocks.forEach((block) => block.instance.destroy());
    this.curves.forEach((curve) => curve.instance.destroy());

    this.blocks = null;
    this.triggers = null;
    this.curves = null;
  }
}
