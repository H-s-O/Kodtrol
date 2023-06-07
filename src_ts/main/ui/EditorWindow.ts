import { MenuItemConstructorOptions } from 'electron';
import { join } from 'path';

import BaseWindow, { createAdditionalArgs, createDevMenu } from './BaseWindow';
import { IS_DEV } from '../constants';

class EditorWindow extends BaseWindow {
  constructor(projectFilePath: string) {
    super({
      id: 'editorwindow',
      defaultWidth: 1600,
      defaultHeight: 900,
      options: {
        webPreferences: {
          preload: join(__dirname, '..', '..', '..', 'build', 'editor', 'editor-preload.js'),
          sandbox: false,
          additionalArguments: createAdditionalArgs({
            projectFilePath,
          }),
        },
      },
    });
    this.window.loadFile(join(__dirname, '..', '..', '..', 'build', 'editor', 'editor.html'));
  }

  protected _generateMenu(): MenuItemConstructorOptions[] {
    return [
      { role: 'windowMenu' },
      ...(IS_DEV ? createDevMenu() : []) as MenuItemConstructorOptions[]
    ];
  }
}

export default EditorWindow;
