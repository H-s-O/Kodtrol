import path from 'path';

export const getCompiledScriptsDir = () => {
  return process.env.MANUSCRIPT_SCRIPTS_DIR;
}

export const getCompiledScriptPath = (scriptId) => {
  return path.join(getCompiledScriptsDir(), `/${scriptId}.js`);
}