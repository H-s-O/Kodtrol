import fs from 'fs';
import path from 'path';
import glob from 'glob';
import BaseScript from './lib/BaseScript';

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
    this.macrosRegexp = new RegExp(`[^.](${Object.keys(this.macros).join('|')})`, 'g');
  }

  static get projectFilePath() {
    return '/Users/hugo/Desktop/project.manuscrit';
  }

  static loadScript(scriptName) {
    const filePath = path.join(ScriptsManager.projectFilePath, `scripts/premier script.js`);
    const scriptContent = fs.readFileSync(filePath, 'utf8');
    return scriptContent;
  }

  static saveScript(scriptName, scriptValue) {
    const filePath = path.join(ScriptsManager.projectFilePath, `scripts/premier script.js`);
    fs.writeFileSync(filePath, scriptValue);
    const className = `Script_${scriptName}`;
    const compiledClass = ScriptsManager.compileClass(className, scriptValue);
    const compiledFilePath = path.join(ScriptsManager.projectFilePath, `scripts_compiled/${className}.js`);
    fs.writeFileSync(compiledFilePath, compiledClass);
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
    const pathPattern = path.join(ScriptsManager.projectFilePath, 'scripts/**/*.js');
    const foundScripts = glob.sync(pathPattern).map((script) => (path.basename(script, '.js')));
    return foundScripts;
  }
}
