import {
  contextBridge, ipcRenderer,
} from 'electron/renderer';
import { readFile } from 'fs/promises';
import { basename } from 'path';

import { extractAdditionalData } from '../common/lib/helpers';
import { IPC_MAIN_CHANNEL_WARN_BEFORE_DELETE } from '../../common/constants';

const additionalArgs = extractAdditionalData();

const readProjectFile = async () => {
  const fileContent = await readFile(additionalArgs.projectFilePath, { encoding: 'utf-8' });
  return JSON.parse(fileContent);
};

/** Invokes a native warning alert box on the main process */
const deleteWarningDialog = (message: string, detail?: string): Promise<boolean> => {
  return ipcRenderer.invoke(IPC_MAIN_CHANNEL_WARN_BEFORE_DELETE, message, detail);
};

const expose = {
  ...additionalArgs,
  readProjectFile,
  deleteWarningDialog,
  path: {
    basename,
  },
};

contextBridge.exposeInMainWorld('kodtrol_editor', expose);

declare global {
  interface Window {
    kodtrol_editor: typeof expose
  }
}
