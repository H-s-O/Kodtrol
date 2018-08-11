import fs from 'fs';
import path from 'path';
import glob from 'glob';
import uniqid from 'uniqid';

import BaseScript from '../lib/BaseScript';
import safeClassName from '../lib/safeClassName';
import { writeJson, readJson } from '../lib/fileSystem';

export default class DevicesManager {
  static init() {
    this._devices = {};
  }

  static set projectFilePath(path) {
    this._projectFilePath = path;
  }

  static get projectFilePath() {
    return this._projectFilePath;
  }

  static get devices() {
    return this._devices;
  }

  static loadDevice(deviceId) {
    const filePath = path.join(DevicesManager.projectFilePath, `devices/${deviceId}.json`);
    const deviceContent = fs.readFileSync(filePath, 'utf8');
    return deviceContent;
  }

  static createDevice(deviceData) {
    const id = uniqid();
    const filePath = path.join(DevicesManager.projectFilePath, `devices/${id}.json`);
    writeJson(filePath, {
      id,
      ...deviceData
    });
    return id;
  }

  static saveDevice(deviceName, deviceValue) {
    // const filePath = path.join(DevicesManager.projectFilePath, `devices/${deviceId}.json`);
    // fs.writeFileSync(filePath, scriptValue);
    // const className = safeClassName(`Script_${scriptName}`);
    // const compiledClass = DevicesManager.compileClass(className, scriptValue);
    // const compiledFilePath = path.join(DevicesManager.projectFilePath, `scripts_compiled/${className}.js`);
    // fs.writeFileSync(compiledFilePath, compiledClass);
    // return compiledFilePath;
  }

  static listDevices() {
    const pathPattern = path.join(DevicesManager.projectFilePath, 'devices/**/*.json');
    const foundDevices = glob.sync(pathPattern).map((device) => {
      const deviceData = readJson(device);
      const { id, name } = deviceData;
      this._devices[id] = deviceData;
      return {
        id,
        name,
      };
    });
    return foundDevices;
  }
}
