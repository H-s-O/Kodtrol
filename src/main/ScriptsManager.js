import fs from 'fs';
import path from 'path';
import glob from 'glob';
import uniqid from 'uniqid';
import { get, set } from 'lodash';
import { writeJson, readJson, writeFile } from './lib/fileSystem';
import BaseScript from './lib/BaseScript';
import safeClassName from './lib/safeClassName';

export default class ScriptsManager {
  static init() {
    const baseProto = BaseScript.prototype;
    this.macros = Object.getOwnPropertyNames(baseProto).
      filter((prop) => (
        typeof baseProto[prop] === 'function' && prop !== 'constructor' && prop[0] === '_'
      ))
      .reduce((acc, prop) => ({
        ...acc,
        [prop.substring(1)]: baseProto[prop].toString(),
      }), {});
    this.macrosRegexp = new RegExp(`(?<!.)?(${Object.keys(this.macros).join('|')})`, 'g');
  }

  static set projectFilePath(path) {
    this._projectFilePath = path;
  }

  static get projectFilePath() {
    return this._projectFilePath;
  }

  static loadScript(scriptId) {
    const filePath = path.join(ScriptsManager.projectFilePath, `scripts/${scriptId}.json`);
    const scriptData = readJson(filePath);
    const scriptContent = get(scriptData, 'content', '');
    return scriptContent;
  }

  static createScript(scriptName) {
    const id = uniqid();
    const filePath = path.join(ScriptsManager.projectFilePath, `scripts/${id}.json`);
    writeJson(filePath, {
      id,
      name: scriptName,
      content: '',
      devices: [],
    });
    return id;
  }

  static saveScript(scriptId, scriptValue) {
    const filePath = path.join(ScriptsManager.projectFilePath, `scripts/${scriptId}.json`);
    const scriptData = readJson(filePath);
    set(scriptData, 'content', scriptValue);
    writeJson(filePath, scriptData);

    const className = safeClassName(`Script_${scriptId}`);
    const compiledClass = ScriptsManager.compileClass(className, scriptValue);
    const compiledFilePath = path.join(ScriptsManager.projectFilePath, `scripts_compiled/${scriptId}.js`);
    writeFile(compiledFilePath, compiledClass);
    return compiledFilePath;
  }

  static compileClass(className, classBody) {
    const helpersList = [];
    const convertedFunctions = classBody.replace(/function (loop|start|end|beat)/g, '$1');
    const convertedMacros = convertedFunctions.replace(this.macrosRegexp, (fullMatch, macro) => {
      if (helpersList.indexOf(macro) === -1) {
        helpersList.push(macro);
      }
      return `_${macro}`;
    });
    const helpersContent = helpersList
      .map((helper) => (this.macros[helper]))
      .join('\n');
    const finalBody = `${helpersContent}\nmodule.exports = class ${className} {\n${convertedMacros}\n}`;
    return finalBody;
  }

  static listScripts() {
    const pathPattern = path.join(ScriptsManager.projectFilePath, 'scripts/**/*.json');
    const foundScripts = glob.sync(pathPattern).map((script) => {
      const scriptData = readJson(script);
      const { id, name } = scriptData;
      return {
        id,
        name,
      }
    });
    return foundScripts;
  }
}
