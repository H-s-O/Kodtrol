import fs from 'fs';
import path from 'path';
import glob from 'glob';
import uniqid from 'uniqid';
import safeClassName from './lib/safeClassName';
import { writeJson, readJson } from './lib/fileSystem';
import Timeline from './models/Timeline';

export default class TimelinesManager {
  static init() {
    this._timelines = {};
  }

  static set projectFilePath(path) {
    this._projectFilePath = path;
  }

  static get projectFilePath() {
    return this._projectFilePath;
  }

  static loadTimeline(timelineId) {
    const filePath = path.join(TimelinesManager.projectFilePath, `timelines/${timelineId}.json`);
    const timelineContent = readJson(filePath);
    return timelineContent;
  }

  static createTimeline(timelineData) {
    const id = uniqid();
    const filePath = path.join(TimelinesManager.projectFilePath, `timelines/${id}.json`);
    writeJson(filePath, {
      id,
      layers: [],
      zoom: 1,
      ...timelineData
    });
    return id;
  }

  static saveTimeline(timelineId, timelineData) {
    const filePath = path.join(TimelinesManager.projectFilePath, `timelines/${timelineId}.json`);
    writeJson(filePath, timelineData);
    return timelineData;
  }

  static listTimelines() {
    const pathPattern = path.join(TimelinesManager.projectFilePath, 'timelines/**/*.json');
    const foundTimelines = glob.sync(pathPattern).map((timeline) => {
      const timelineData = readJson(timeline);
      const { id, name } = timelineData;
      this._timelines[id] = timelineData;
      return {
        id,
        name,
      };
    });
    return foundTimelines;
  }

  static get timelines() {
    return this._timelines;
  }
}
