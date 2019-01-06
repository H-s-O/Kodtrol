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
      .map((block) => {
        return {
          ...block,
          instance: new ScriptRenderer(this._providers, block.script, false),
        };
      });
      
    this._audios = timelineItems
      .filter((item) => 'file' in item)
      .map((audio) => {
        return {
          ...audio,
          instance: new AudioRenderer(this._providers, audio),
        };
      });
    
    this._triggers = timelineItems
      .filter((item) => 'trigger' in item)
      .map((trigger) => {
        return {
          ...trigger,
          instance: new TriggerRenderer(),
        };
      });
      
    this._curves = timelineItems
      .filter((item) => 'curve' in item)
      .map((curve) => {
        return {
          ...curve,
          instance: new CurveRenderer(curve),
        };
      });
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

    const triggerData = this._triggers
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

    const curveData = this._curves
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

    this._blocks
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
        
        block.instance.render(currentTime, blockInfo, triggerData, curveData);
      }, {});
    
    this._audios
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
        
        audio.instance.render(currentTime, audioInfo);
      }, {});
  }

  beat = (beat, delta) => {
    const currentTime = this._currentTime + delta;
    // console.log(delta);
    this._blocks
      .filter((block) => (
        currentTime >= block.inTime
        && currentTime <= block.outTime
      ))
      .forEach((block) => {
        block.instance.beat(beat, currentTime);
      });
  }
  
  input = (type, data) => {
    const currentTime = this._currentTime;
    
    this._blocks
      .filter((block) => (
        currentTime >= block.inTime
        && currentTime <= block.outTime
      ))
      .forEach((block) => {
        block.instance.input(type, data);
      });
  }

  restartTimeline = () => {
    this.resetBlocks();
    this.resetTriggers();
    this.resetCurves();
    this.resetAudios();
  }

  resetBlocks = () => {
    this._blocks.forEach((block) => block.instance.reset());
  }

  resetTriggers = () => {
    this._triggers.forEach((trigger) => trigger.instance.reset());
  }

  resetCurves = () => {
    this._curves.forEach((curve) => curve.instance.reset());
  }

  resetAudios = () => {
    this._audios.forEach((audio) => audio.instance.reset());
  }

  destroy = () => {
    this._blocks.forEach((block) => block.instance.destroy());
    this._curves.forEach((curve) => curve.instance.destroy());

    this.blocks = null;
    this.triggers = null;
    this.curves = null;
  }
}
