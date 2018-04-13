import { readJsonSync, writeJsonSync, ensureFileSync, ensureDirSync } from 'fs-extra';
import { app } from 'electron';
import path from 'path';

export const getAppConfigPath = () => {
  const userData = app.getPath('userData');
  const configPath = path.join(userData, 'Config');
  return configPath;
}

export const ensureFile = (path) => {
  return ensureFileSync(path);
};

export const ensureDir = (path) => {
  return ensureDirSync(path);
};

export const readJson = (path, data) => {
  return readJsonSync(path);
};

export const writeJson = (path, data) => {
  writeJsonSync(path, data);
};

export const readAppConfig = () => {
  const configPath = getAppConfigPath();
  try {
    const config = readJson(configPath);
    return config;
  } catch (err) {
    return {};
  }
}

export const writeAppConfig = (data) => {
  const configPath = getAppConfigPath();
  writeJson(configPath, data);
}

export const createProject = (projectPath) => {
  const projectDir = path.join(`${projectPath}.manuscrit`);
  ensureDir(projectDir);
  const scriptsDir = path.join(projectDir, 'scripts');
  ensureDir(scriptsDir);
  const compiledScriptsDir = path.join(projectDir, 'scripts_compiled');
  ensureDir(compiledScriptsDir);
  const devicesDir = path.join(projectDir, 'devices');
  ensureDir(devicesDir);
  return projectDir;
};
