import {
  Menu,
  MenuItemConstructorOptions,
  contextBridge,
} from 'electron/renderer';
import { extractAdditionalData } from '../lib/helpers';

const additionalArgs = extractAdditionalData();

const readProjectFile = () => {
  // @TODO
  return new Promise<object>((resolve) => resolve({}));
};

const menuFromTemplate = (template: MenuItemConstructorOptions[]) => {
  return Menu.buildFromTemplate(template);
};

contextBridge.exposeInMainWorld('kodtrol_editor', {
  ...additionalArgs,
  readProjectFile,
  menuFromTemplate,
});
