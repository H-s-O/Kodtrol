import { shell } from 'electron';

export default (path) => {
  shell.openItem(path);
};
