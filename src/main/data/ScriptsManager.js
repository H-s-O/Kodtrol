import path from 'path';
import { app } from 'electron';

import { writeFile, ensureDir } from '../lib/fileSystem';
import BaseScript from '../lib/BaseScript';
import safeClassName from '../lib/safeClassName';

export default class ScriptsManager {
  static init() {
    this._scripts = {};

    const baseProto = BaseScript;
    this.macros = Object.keys(baseProto).
      filter((prop) => (
        typeof baseProto[prop] === 'function' && prop[0] === '_'
      ))
      .reduce((acc, prop) => {
        let funcBody = baseProto[prop].toString();
        if (baseProto[prop].name !== prop) {
          funcBody = funcBody.replace(/function (.+)\(/, `function ${prop}(`);
        }
        return {
          ...acc,
          [prop.substring(1)]: funcBody,
        };
      }, {});
    this.macrosRegexp = new RegExp(`(?<!\\.)(${Object.keys(this.macros).join('|')})`, 'g');
    
    // Make sure the destination dir for compiled scripts exists
    ensureDir(ScriptsManager.getCompiledScriptsDir());
  }

  static set projectFilePath(path) {
    this._projectFilePath = path;
  }

  static get projectFilePath() {
    return this._projectFilePath;
  }

  static get scripts() {
    return this._scripts;
  }

  static loadCompiledScript(scriptId) {
    const scriptPath = ScriptsManager.getCompiledScriptPath(scriptId);
    const scriptClass = require(scriptPath);
    return scriptClass;
  }
  
  static compileScripts(scripts) {
    return scripts.map((script) => ScriptsManager.compileScript(script));
  }
  
  static compileScript(script) {
    const { id, content } = script;
    console.log('ScriptsManager.compileScript', id);
    const className = safeClassName(`Script_${id}`);
    const compiledClass = ScriptsManager.compileClass(className, content);
    const compiledFilePath = ScriptsManager.getCompiledScriptPath(id);
    
    writeFile(compiledFilePath, compiledClass);

    ScriptsManager.invalidateCompiledScript(id);
    
    return compiledFilePath;
  }

  static invalidateCompiledScript(scriptId) {
    const scriptPath = ScriptsManager.getCompiledScriptPath(scriptId);
    delete require.cache[scriptPath];
  }

  static compileClass(className, classBody) {
    const helpersList = [];
    const convertedFunctions = classBody.replace(/function (frame|start|end|beat|input|setup)/g, '$1');
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
  
  static getCompiledScriptsDir() {
    return path.join(app.getPath('userData'), 'scripts_compiled');
  }

  static getCompiledScriptPath(scriptId) {
    return path.join(ScriptsManager.getCompiledScriptsDir(), `/${scriptId}.js`);
  }
}
