import path from 'path';

export const getCompiledScriptsDir = () => {
  return process.env.KODTROL_SCRIPTS_DIR;
}

export const getConvertedAudiosDir = () => {
  return process.env.KODTROL_AUDIOS_DIR;
}

export const getCompiledScriptPath = (scriptId) => {
  return path.join(getCompiledScriptsDir(), `${scriptId}.js`);
}

export const getConvertedAudioPath = (audioId) => {
  return path.join(getConvertedAudiosDir(), `${audioId}.pcm`);
}
