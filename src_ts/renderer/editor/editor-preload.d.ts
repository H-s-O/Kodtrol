import { Menu, MenuItemConstructorOptions } from 'electron/renderer';
import { WindowAdditionalArgs } from '../../common/types';

declare global {
  interface Window {
    kodtrol_editor: {
      readProjectFile(): Promise<object>
      menuFromTemplate(template: MenuItemConstructorOptions[]): Menu
    } & WindowAdditionalArgs
  }
}

export { };
