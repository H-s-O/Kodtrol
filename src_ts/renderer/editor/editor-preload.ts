import {
  Menu,
  MenuItemConstructorOptions,
  contextBridge,
} from 'electron/renderer';
import { extractAdditionalData } from '../lib/helpers';

const additionalArgs = extractAdditionalData()
console.log(additionalArgs);

const APP_VERSION = '0.2.0'

const readProjectFile = () => {
  // @TODO
  return new Promise<object>((resolve) => resolve({}));
};

const menuFromTemplate = (template: MenuItemConstructorOptions[]) => {
  return Menu.buildFromTemplate(template);
};

contextBridge.exposeInMainWorld('kodtrol_editor', {
  APP_VERSION,
  readProjectFile,
  menuFromTemplate,
});
