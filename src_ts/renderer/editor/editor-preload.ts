import {
  contextBridge,
} from 'electron/renderer';
import { readFile } from 'fs/promises'

import { extractAdditionalData } from '../common/lib/helpers';

const additionalArgs = extractAdditionalData();

const readProjectFile = async () => {
  const fileContent = await readFile(additionalArgs.projectFilePath, { encoding: 'utf-8' });
  return JSON.parse(fileContent);
};

/** Invokes a native warning alert box on the main process */
const deleteWarningDialog = (message: string) => new Promise<boolean>(() => { }); // @TODO

const expose = {
  ...additionalArgs,
  readProjectFile,
  deleteWarningDialog,
};

contextBridge.exposeInMainWorld('kodtrol_editor', expose);

declare global {
  interface Window {
    kodtrol_editor: typeof expose
  }
}
