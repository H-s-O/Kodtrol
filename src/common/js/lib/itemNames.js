import { basename } from 'path';

export const getScriptName = ({ name, script }, scriptsNames) => {
  return name || scriptsNames[script] || '[no name]';
};

export const getMediaName = ({ name, file }) => {
  return name || basename(file) || '[no name]';
};
