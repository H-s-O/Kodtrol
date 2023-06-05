import { MenuItemConstructorOptions } from 'electron';
import { join } from 'path';

import BaseWindow from './BaseWindow';
import { IS_DEV } from '../constants';

class EditorWindow extends BaseWindow {
  constructor() {
    super({
      id: 'editorwindow',
      defaultWidth: 1600,
      defaultHeight: 900,
      options: {
        webPreferences: {
          preload: join(__dirname, '..', '..', '..', 'build', 'editor', 'editor-preload.js'),
          sandbox: false,
        },
      },
    });
    this.loadFile(join(__dirname, '..', '..', '..', 'build', 'editor', 'editor.html'));
  }

  protected _generateMenu(): MenuItemConstructorOptions[] {
    return [
      { role: 'windowMenu' },
      ...(IS_DEV ? EditorWindow._getWindowDevMenu() : []) as MenuItemConstructorOptions[]
    ];
  }
}

export default EditorWindow;
