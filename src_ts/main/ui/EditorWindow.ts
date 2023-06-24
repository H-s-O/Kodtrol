import { MenuItemConstructorOptions, MessagePortMain } from 'electron/main';
import { join } from 'path';

import BaseWindow, { createAdditionalArgs, createDevMenu } from './BaseWindow';
import { IS_DEV, IS_MAC } from '../constants';
import { APP_NAME } from '../../common/constants';

class EditorWindow extends BaseWindow {
  constructor(projectFilePath: string, messagePort: MessagePortMain) {
    super({
      id: 'editorwindow',
      messagePort,
      defaultWidth: 1600,
      defaultHeight: 900,
      options: {
        webPreferences: {
          preload: join(__dirname, '..', '..', '..', 'build', 'editor', 'kodtrol-editor-preload.js'),
          sandbox: false,
          additionalArguments: createAdditionalArgs({
            projectFilePath,
          }),
        },
      },
    });
    this.window.loadFile(join(__dirname, '..', '..', '..', 'build', 'editor', 'kodtrol-editor.html'));
  }

  protected _generateMenu(): MenuItemConstructorOptions[] {
    return [
      ...(IS_MAC ? [
        {
          label: APP_NAME,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ] : []) as MenuItemConstructorOptions[],
      {
        label: 'File',
        submenu: [
          {
            label: 'Create project...',
            accelerator: 'CommandOrControl+N',
            // click: this.onCreateProjectClick,
            enabled: false,
          },
          {
            label: 'Open project...',
            accelerator: 'CommandOrControl+O',
            // click: this.onOpenProjectClick,
            enabled: false,
          },
          {
            type: 'separator',
          },
          {
            label: 'Save project',
            accelerator: 'CommandOrControl+Shift+S',
            // click: this.onSaveProjectClick,
            enabled: false,
          },
          {
            label: 'Close project',
            // click: this.onCloseProjectClick,
            enabled: false,
          },
          ...(!IS_MAC ? [
            { type: 'separator' },
            { role: 'quit' },
          ] : []) as MenuItemConstructorOptions[],
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'copy' },
          { role: 'cut' },
          { role: 'paste' },
          { role: 'selectAll' },
        ],
      },
      { role: 'windowMenu' },
      ...(IS_DEV ? createDevMenu() : []) as MenuItemConstructorOptions[]
    ];
  }
}

export default EditorWindow;
