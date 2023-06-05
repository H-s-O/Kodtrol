import { Menu, MenuItemConstructorOptions, contextBridge } from 'electron';

const readProjectFile = () => {
  // @TODO
  return new Promise<object>((resolve) => resolve({}));
};

const menuFromTemplate = (template: MenuItemConstructorOptions[]) => {
  return Menu.buildFromTemplate(template);
};

contextBridge.exposeInMainWorld('kodtrol', {
  readProjectFile,
  menuFromTemplate,
});
