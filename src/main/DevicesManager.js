import fs from 'fs';
import path from 'path';
import glob from 'glob';
import BaseScript from './lib/BaseScript';
import safeClassName from './lib/safeClassName';
import { writeJson } from './lib/fileSystem';

export default class DevicesManager {
  static init() {
  }

  static set projectFilePath(path) {
    this._projectFilePath = path;
  }

  static get projectFilePath() {
    return this._projectFilePath;
  }

  static loadDevice(deviceName) {
    const filePath = path.join(DevicesManager.projectFilePath, `devices/${deviceName}.json`);
    const deviceContent = fs.readFileSync(filePath, 'utf8');
    return deviceContent;
  }

  static createDevice(deviceData) {
    const { name, type } = deviceData;
    const filePath = path.join(DevicesManager.projectFilePath, `devices/${name}.json`);
    writeJson(filePath, {
      name,
      type,
    });
    return filePath;
  }

  static saveDevice(scriptName, scriptValue) {
    const filePath = path.join(DevicesManager.projectFilePath, `devices/${scriptName}.json`);
    fs.writeFileSync(filePath, scriptValue);
    const className = safeClassName(`Script_${scriptName}`);
    const compiledClass = DevicesManager.compileClass(className, scriptValue);
    const compiledFilePath = path.join(DevicesManager.projectFilePath, `scripts_compiled/${className}.js`);
    fs.writeFileSync(compiledFilePath, compiledClass);
    return compiledFilePath;
  }

  static listDevices() {
    const pathPattern = path.join(DevicesManager.projectFilePath, 'devices/**/*.json');
    const foundScripts = glob.sync(pathPattern).map((script) => (path.basename(script, '.json')));
    return foundScripts;
  }
}
