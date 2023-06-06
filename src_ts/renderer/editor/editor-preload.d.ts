import { Menu, MenuItemConstructorOptions } from 'electron/renderer';

declare global {
  interface Window {
    kodtrol_editor: {
      APP_VERSION: string,
      readProjectFile(): Promise<object>
      menuFromTemplate(template: MenuItemConstructorOptions[]): Menu
    }
  }
}

export { };
