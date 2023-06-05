import { Menu, MenuItemConstructorOptions } from 'electron';

declare interface Window {
  kodtrol: {
    readProjectFile(): Promise<object>
    menuFromTemplate(template: MenuItemConstructorOptions[]): Menu
  }
}
