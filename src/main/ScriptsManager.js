import fs from 'fs';
import path from 'path';
import macros from './lib/macros';

export default class ScriptsManager {
  static init() {
    // register macros
    macros.define('clamp', (value, min, max, node) => (
      `(${value} < ${min} ? ${min} : ${value} > ${max} ? ${max} : ${value})`
    ));
    macros.define('map', (value, valueMin, valueMax, outMin, outMax, node) => (
      `(${outMin} + (((${value} - ${valueMin}) / (${valueMax} - ${valueMin}) * (${outMax} - ${outMin}))))`
    ));
    macros.define('random', (min, max, node) => (
      `(${min} + (Math.random() * (${max} - ${min})))`
    ));
    macros.define('round', (value, node) => (
      `Math.round(${value})`
    ));
    macros.define('roundUp', (value, node) => (
      `Math.ceil(${value})`
    ));
    macros.define('roundDown', (value, node) => (
      `Math.floor(${value})`
    ));
  }

  static saveScript(scriptName, scriptValue) {
    const processedMacros = macros.process(scriptValue);
    const convertedFunctions = processedMacros.replace(/function (loop|start|end)/g, '$1');
    const className = `Script_${scriptName}`;
    const compiledClass = ScriptsManager.compileClass(className, convertedFunctions);
    console.log(compiledClass);
    const filePath = `/Users/hugo/Desktop/${className}_${Date.now()}.js`;
    fs.writeFileSync(filePath, compiledClass);
    return filePath;
  }

  static compileClass(className, classBody) {
    return `module.exports = class ${className} {\n${classBody}\n}`;
  }
}
