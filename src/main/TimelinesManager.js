import fs from 'fs';
import path from 'path';
import glob from 'glob';
import uniqid from 'uniqid';
import safeClassName from './lib/safeClassName';
import { writeJson, readJson } from './lib/fileSystem';

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
      ...timelineData
    });
    return id;
  }

  static saveTimeline(timelineId, timelineData) {
    // const filePath = path.join(TimelinesManager.projectFilePath, `timelines/${deviceId}.json`);
    // fs.writeFileSync(filePath, scriptValue);
    // const className = safeClassName(`Script_${scriptName}`);
    // const compiledClass = TimelinesManager.compileClass(className, scriptValue);
    // const compiledFilePath = path.join(TimelinesManager.projectFilePath, `scripts_compiled/${className}.js`);
    // fs.writeFileSync(compiledFilePath, compiledClass);
    // return compiledFilePath;
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
