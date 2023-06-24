import {
  contextBridge, ipcRenderer,
} from 'electron/renderer';
import { readFile } from 'fs/promises';
import { basename } from 'path';

import { extractAdditionalData } from '../common/lib/helpers';
import { IPC_MAIN_CHANNEL_WARN_BEFORE_CLOSE, IPC_MAIN_CHANNEL_WARN_BEFORE_DELETE } from '../../common/constants';

const additionalArgs = extractAdditionalData();

const readProjectFile = async (filePath: string) => {
  const fileContent = await readFile(filePath, { encoding: 'utf-8' });
  return JSON.parse(fileContent);
};

const readCurrentProjectFile = () => readProjectFile(additionalArgs.projectFilePath);

/** Invokes a native warning alert box on the main process */
const deleteWarningDialog = (message: string, detail?: string): Promise<boolean> => {
  return ipcRenderer.invoke(IPC_MAIN_CHANNEL_WARN_BEFORE_DELETE, message, detail);
};

/** Invokes a native warning alert box on the main process */
const closeWarningDialog = (message: string, detail?: string): Promise<boolean> => {
  return ipcRenderer.invoke(IPC_MAIN_CHANNEL_WARN_BEFORE_CLOSE, message, detail);
};

const expose = {
  ...additionalArgs,
  readProjectFile,
  readCurrentProjectFile,
  deleteWarningDialog,
  closeWarningDialog,
  path: {
    basename,
  },
} as const;

contextBridge.exposeInMainWorld('kodtrol_editor', expose);

//-------------------------------------------------------------------

const windowLoaded = new Promise((resolve) => {
  window.onload = resolve;
});

ipcRenderer.on('port', async (event) => {
  await windowLoaded;
  window.postMessage('port', '*', event.ports);
});

//-------------------------------------------------------------------

declare global {
  interface Window {
    readonly kodtrol_editor: typeof expose
    kodtrol_enginePort?: MessagePort
  }
}
