import { flatten, uniq, pick } from 'lodash';

import ScriptRenderer from './ScriptRenderer';
import TriggerRenderer from './TriggerRenderer';
import CurveRenderer from './CurveRenderer';
import AudioRenderer from './AudioRenderer';

export default class TimelineRenderer {
  _rendererType = 'timeline';
  _providers = null;
  _timeline = null;
  _currentTime = 0;
  _blocks = null;
  _triggers = null;
  _curves = null;
  _audios = null;
  _timeMap = null;
  
  constructor(providers, timelineId) {
    this._providers = providers;
    
    this.setTimelineAndItems(timelineId);
  }
  
  setTimelineAndItems = (timelineId) => {
    this._timeline = this._providers.getTimeline(timelineId);
    
    // "Prepare" data
    const layersById = this._timeline.layers.reduce((obj, layer) => {
      return {
        ...obj,
        [layer.id]: layer,
      }
    }, {});
    
    // Extract timeline items
    const timelineItems = this._timeline.items.sort((a, b) => {
      return layersById[a.layer].order - layersById[b.layer].order;
    });
    
    this._blocks = timelineItems
      .filter((item) => 'script' in item)
      .reduce((obj, block) => {
        return {
          ...obj,
          [block.id]: {
            ...block,
            instance: new ScriptRenderer(this._providers, block.script, false),
          },
        };
      }, {});
      
    this._audios = timelineItems
      .filter((item) => 'file' in item)
      .reduce((obj, audio) => {
        return {
          ...obj,
          [audio.id]: {
            ...audio,
            instance: new AudioRenderer(this._providers, audio),
          },
        };
      }, {});
    
    this._triggers = timelineItems
      .filter((item) => 'trigger' in item)
      .reduce((obj, trigger) => {
        return {
          ...obj,
          [trigger.id]: {
            ...trigger,
            instance: new TriggerRenderer(),
          },
        };
      }, {});
      
    this._curves = timelineItems
      .filter((item) => 'curve' in item)
      .reduce((obj, curve) => {
        return {
          ...obj,
          [curve.id]: {
            ...curve,
            instance: new CurveRenderer(curve),
          },
        };
      }, {});
    
    // Warning, experimental stuff below  
    const timeMap = [];
    const duration = this._timeline.duration;
    const itemsCount = timelineItems.length;
    const divisor = 1000;
    for (let t = 0; t < duration; t += divisor) {
      const timeIndex = (t / divisor) >> 0;
      const end = t + divisor;
      for (let i = 0; i < itemsCount; i++) {
        const item = timelineItems[i];
        const { id, inTime, outTime, script, file, trigger, curve } = item;
        let addIt = false;
        if (typeof outTime !== 'undefined') {
          if (
              (inTime >= t && inTime <= end)
              || (outTime >= t && outTime <= end)
              || (inTime < t && outTime > end)
            ) {
            addIt = true;
          }
        } else if (inTime >= t && inTime <= end) {
          addIt = true;
        }
        if (addIt) {
          let addIndex = null;
          if (typeof script !== 'undefined') {
            addIndex = 2;
          } else if (typeof file !== 'undefined') {
            addIndex = 3;
          } else if (typeof trigger !== 'undefined') {
            addIndex = 0;
          } else if (typeof curve !== 'undefined') {
            addIndex = 1;
          } 
          if (addIndex !== null) {
            if (!timeMap[timeIndex]) {
              timeMap[timeIndex] = [
                [], // triggers
                [], // curves
                [], // blocks
                [], // medias
              ];
            }
            timeMap[timeIndex][addIndex].push(id);
          }
        }
      }
    }
    this._timeMap = timeMap;
    // console.log(this._timeMap);
  }
  
  get rendererType() {
    return this._rendererType;
  }
  
  get timeline() {
    return this._timeline;
  }
  
  get currentTime() {
    return this._currentTime;
  }

  setPosition = (position) => {
    this._currentTime = position;
    this.resetBlocks();
    this.resetTriggers();
    this.resetCurves();
    this.resetAudios()
  }
  
  render = (delta) => {
    this._currentTime += delta;
    
    const currentTime = this._currentTime;
    if (currentTime > this._timeline.outTime) {
      // this.restartTimeline();
      // currentTime = 0;
      // @TODO
      return;
    }
    
    const timeMap = this._timeMap;
    const timeDivisor = 1000;
    const timeIndex = (currentTime / timeDivisor) >> 0;
    if (timeIndex > timeMap.length || !timeMap[timeIndex]) {
      // Nothing to render
      return;
    }
    const timeItems = timeMap[timeIndex];
    // console.log(timeItems);
    
    const triggers = timeItems[0];
    const triggerCount = triggers.length;
    const triggerData = {};
    for (let i = 0; i < triggerCount; i++) {
      const trigger = this._triggers[triggers[i]];
      if (
        currentTime >= trigger.inTime
        && currentTime <= trigger.inTime + 50 // 2 frames
        && !trigger.instance.triggered
      ) {
        const data = trigger.instance.render();
        
        triggerData[trigger.trigger] = true;
      }
    }

    const curves = timeItems[1];
    const curveCount = curves.length;
    const curveData = {};
    for (let i = 0; i < curveCount; i++) {
      const curve = this._curves[curves[i]];
      if (
        currentTime >= curve.inTime
        && currentTime <= curve.outTime
      ) {
        const { inTime, outTime } = curve;
        const curveInfo = {
          inTime,
          outTime,
          currentTime,
          curvePercent: ((currentTime - inTime) / (outTime - inTime)),
        };
        
        const data = curve.instance.render(currentTime, curveInfo);
        
        curveData[curve.name] = data;
      }
    }

    const blocks = timeItems[2];
    const blockCount = blocks.length;
    for (let i = 0; i < blockCount; i++) {
      const block = this._blocks[blocks[i]];
      if (
        currentTime >= block.inTime - 500 // @TODO config script setup delay
        && currentTime <= block.outTime
      ) {
        const { inTime, outTime } = block;
        const blockInfo = {
          inTime,
          outTime,
          currentTime,
          blockPercent: ((currentTime - inTime) / (outTime - inTime)),
        };
        
        block.instance.render(currentTime, blockInfo, triggerData, curveData);
      }
    }
    
    const medias = timeItems[3];
    const mediaCount = medias.length;
    for (let i = 0; i < mediaCount; i++) {
      const media = this._audios[medias[i]];
      if (
        currentTime >= media.inTime
        && currentTime <= media.outTime
      ) {
        const { id, inTime, outTime } = media;
        const mediaInfo = {
          inTime,
          outTime,
          currentTime,
          audioPercent: ((currentTime - inTime) / (outTime - inTime)),
        };
        
        media.instance.render(currentTime, mediaInfo);
      }
    }
  }

  beat = (beat, delta) => {
    // const currentTime = this._currentTime + delta;
    // // console.log(delta);
    // this._blocks
    //   .filter((block) => (
    //     currentTime >= block.inTime
    //     && currentTime <= block.outTime
    //   ))
    //   .forEach((block) => {
    //     block.instance.beat(beat, currentTime);
    //   });
  }
  
  input = (type, data) => {
    // const currentTime = this._currentTime;
    // 
    // this._blocks
    //   .filter((block) => (
    //     currentTime >= block.inTime
    //     && currentTime <= block.outTime
    //   ))
    //   .forEach((block) => {
    //     block.instance.input(type, data);
    //   });
  }

  restartTimeline = () => {
    this.resetBlocks();
    this.resetTriggers();
    this.resetCurves();
    this.resetAudios();
  }

  resetBlocks = () => {
    Object.values(this._blocks).forEach((block) => block.instance.reset());
  }

  resetTriggers = () => {
    Object.values(this._triggers).forEach((trigger) => trigger.instance.reset());
  }

  resetCurves = () => {
    Object.values(this._curves).forEach((curve) => curve.instance.reset());
  }

  resetAudios = () => {
    Object.values(this._audios).forEach((audio) => audio.instance.reset());
  }

  destroy = () => {
    Object.values(this._blocks).forEach((block) => block.instance.destroy());
    Object.values(this._curves).forEach((curve) => curve.instance.destroy());

    this.blocks = null;
    this.triggers = null;
    this.curves = null;
  }
}
