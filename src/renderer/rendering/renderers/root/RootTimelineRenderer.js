import BaseRootRenderer from '../root/BaseRootRenderer';
import ScriptRenderer from '../items/ScriptRenderer';
import TriggerRenderer from '../items/TriggerRenderer';
import CurveRenderer from '../items/CurveRenderer';
import AudioRenderer from '../items/AudioRenderer';
import timeToPPQ from '../../../lib/timeToPPQ';

export default class RootTimelineRenderer extends BaseRootRenderer {
  _timeline = null;
  _blocks = null;
  _triggers = null;
  _curves = null;
  _audios = null;
  _timeMap = null;
  _timeDivisor = 1000;
  _endCallback = null;
  
  constructor(providers, timelineId, endCallback) {
    super(providers);

    this._endCallback = endCallback;

    this._setTimelineAndItems(timelineId);
  }
  
  _setTimelineAndItems = (timelineId) => {
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
            instance: new ScriptRenderer(this._providers, block.script),
            localBeatPos: -1,
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

    // Speedy stuff below
    const timeMap = [];
    const duration = this._timeline.duration;
    const itemsCount = timelineItems.length;
    const divisor = this._timeDivisor;
    for (let t = 0; t < duration; t += divisor) {
      const timeIndex = (t / divisor) >> 0;
      const end = t + divisor - 1;
      for (let i = 0; i < itemsCount; i++) {
        const item = timelineItems[i];
        const { id, inTime, outTime, script, file, trigger, curve } = item;
        let trueInTime, trueOutTime;
        if (typeof trigger !== 'undefined') {
          trueInTime = inTime;
          // Fake a duration of at two divisions; this will
          // make triggers with inTime near the end of a division to span at least two
          // divisions, which will lessen the chance of being missed when there's lag
          trueOutTime = inTime + divisor;
        } else if (typeof script !== 'undefined') {
          trueInTime = inTime - 500; // @TODO config script leadIn delay
          trueOutTime = outTime + 500; // @TODO config script leadOut delay
        } else {
          trueInTime = inTime;
          trueOutTime = outTime;
        }
        if (
            (trueInTime >= t && trueInTime <= end) // division at start
            || (trueOutTime >= t && trueOutTime <= end) // division at end
            || (trueInTime < t && trueOutTime > end) // division in middle
          ) {
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
            // timeMap[timeIndex][addIndex].push(item);
          }
        }
      }
      /*if (timeMap[timeIndex]) {
        for (let sub = 0; sub < 4; sub++) {
          const subArr = timeMap[timeIndex][sub].sort((a, b) => a.inTime - b.inTime); // sort by inTime
          const subItemsCount = subArr.length;
          for (let ii = 0; ii < subItemsCount; ii++) {
            subArr[ii] = subArr[ii].id; // "map"
          }
        }
      }*/
    }
    this._timeMap = timeMap;
  }
  
  get timeline() {
    return this._timeline;
  }

  setPosition = (position) => {
    this._currentTime = position;
    this._currentBeatPos = -1;
    this.resetBlocks();
    this.resetTriggers();
    this.resetCurves();
    this.resetAudios()
  }
  
  notifyPlay = () => {
    
  }
  
  notifyStop = () => {
    // Stop all medias
    Object.values(this._audios).forEach(({instance}) => instance.stop());
  }

  _getRenderingTempo = () => {
    return this._timeline.tempo;
  }
  
  _runFrame = (frameTime) => {
    const currentTime = this._currentTime;
    if (currentTime >= this._timeline.outTime) {
      this._currentTime = this._timeline.outTime;
      this._endCallback();
      return;
    }
    
    const timeItems = this._getTimelineItemsAtTime(currentTime);
    if (timeItems === null) {
      // Nothing to render
      return;
    }

    const triggers = timeItems[0];
    const triggerCount = triggers.length;
    const triggerData = {};
    for (let i = 0; i < triggerCount; i++) {
      const trigger = this._triggers[triggers[i]];
      if (
        currentTime >= trigger.inTime
        && !trigger.instance.triggered
      ) {
        trigger.instance.render();
        
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
        currentTime >= block.inTime - 500 // @TODO config script leadIn time
        && currentTime <= block.outTime + 500 // @TODO config script leadOut time
      ) {
        const { inTime, outTime } = block;
        let blockPercent;
        if (currentTime < inTime) {
          blockPercent = ((currentTime - inTime + 500) / 500) - 1;
        } else if (currentTime > outTime) {
          blockPercent = ((currentTime - outTime + 500) / 500);
        } else {
          blockPercent = ((currentTime - inTime) / (outTime - inTime));
        }
        const blockInfo = {
          inTime,
          outTime,
          currentTime,
          blockPercent,
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

  _runBeat = (beatPos) => {
    const currentTime = this._currentTime;
    
    const timeItems = this._getTimelineItemsAtTime(currentTime);
    if (timeItems === null) {
      return;
    }

    const tempo = this._getRenderingTempo();

    const blocks = timeItems[2];
    const blockCount = blocks.length;
    for (let i = 0; i < blockCount; i++) {
      const block = this._blocks[blocks[i]];
      if (
        currentTime >= block.inTime
        && currentTime <= block.outTime
      ) {
        const localBeatPos = timeToPPQ(currentTime - block.inTime, tempo);
        if (localBeatPos !== block.localBeatPos) {
          block.instance.beat(beatPos, localBeatPos);
          block.localBeatPos = localBeatPos;
        }
      }
    }
  }
  
  _runInput = (type, data) => {
    const currentTime = this._currentTime;
    
    const timeItems = this._getTimelineItemsAtTime(currentTime);
    if (timeItems === null) {
      return;
    }
    
    const blocks = timeItems[2];
    const blockCount = blocks.length;
    for (let i = 0; i < blockCount; i++) {
      const block = this._blocks[blocks[i]];
      if (
        currentTime >= block.inTime
        && currentTime <= block.outTime
      ) {
        block.instance.input(type, data);
      }
    }
  }
  
  _getTimelineItemsAtTime = (time) => {
    const timeMap = this._timeMap;
    const timeDivisor = this._timeDivisor;
    const timeIndex = (time / timeDivisor) >> 0;
    if (timeIndex < 0 || timeIndex >= timeMap.length || !timeMap[timeIndex]) {
      return null;
    }
    return timeMap[timeIndex];
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

    this._blocks = null;
    this._triggers = null;
    this._curves = null;
    this._audios = null;

    // super.destroy(); // @TODO needs babel update
  }
}
