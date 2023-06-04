import { MenuItemConstructorOptions } from 'electron';
import { join } from 'path';

import BaseWindow from './BaseWindow';

class EditorWindow extends BaseWindow {
  constructor() {
    super({
      id: 'editorwindow',
      defaultWidth: 1600,
      defaultHeight: 900,
    });
    this.loadFile(join(__dirname, '..', '..', '..', 'build', 'editor', 'editor.html'));
  }

  protected _generateMenu(): MenuItemConstructorOptions[] {
    return [];
  }
}

export default EditorWindow;
