import fs from 'fs';
import path from 'path';
import macros from './lib/macros';

export default class ScriptsManager {
  static init() {
    // register macros
    macros.define('clamp', (value, min, max, node) => (
      `${value} < ${min} ? ${min} : ${value} > ${max} ? ${max} : ${value}`
    ));
  }
  static saveScript(scriptName, scriptValue) {
    const processedMacros = macros.process(scriptValue);
    console.log('saveScript', processedMacros);
  }
}
