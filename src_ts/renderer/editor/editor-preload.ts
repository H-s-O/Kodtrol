import {
  Menu,
  MenuItemConstructorOptions,
  contextBridge,
} from 'electron/renderer';
import { readFile } from 'fs/promises'

import { extractAdditionalData } from '../lib/helpers';

const additionalArgs = extractAdditionalData();

const readProjectFile = async () => {
  const fileContent = await readFile(additionalArgs.projectFilePath, { encoding: 'utf-8' });
  return JSON.parse(fileContent);
};

const menuFromTemplate = (template: MenuItemConstructorOptions[]) => {
  return Menu.buildFromTemplate(template);
};

/** Invokes a native warning alert box on the main process */
const deleteWarningDialog = (message: string) => new Promise<boolean>(() => { }); // @TODO

const expose = {
  ...additionalArgs,
  readProjectFile,
  menuFromTemplate,
  deleteWarningDialog,
};

contextBridge.exposeInMainWorld('kodtrol_editor', expose);

declare global {
  interface Window {
    kodtrol_editor: typeof expose
  }
}
