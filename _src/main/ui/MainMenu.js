import EventEmitter from 'events';
import { Menu } from 'electron';

import * as MainMenuEvent from '../events/MainMenuEvent';
import openExternalFolder from '../../common/js/lib/openExternalFolder';
import { getCompiledScriptsDir } from '../lib/fileSystem';
import { APP_NAME } from '../../common/js/constants/app';
import isDev from '../../common/js/lib/isDev';
import { isMac } from '../../common/js/lib/platforms';

export default class MainMenu extends EventEmitter {
  constructor() {
    super();

    const template = [
      ...(isMac ? [
        {
          label: APP_NAME,
          submenu: [
            {
              role: 'about',
            },
            {
              type: 'separator',
            },
            {
              role: 'quit',
            },
          ],
        },
      ] : []),
      {
        label: 'File',
        submenu: [
          {
            label: 'Create project...',
            accelerator: 'CommandOrControl+N',
            click: this.onCreateProjectClick,
          },
          {
            label: 'Open project...',
            accelerator: 'CommandOrControl+O',
            click: this.onOpenProjectClick,
          },
          {
            type: 'separator',
          },
          {
            label: 'Save project',
            accelerator: 'CommandOrControl+Shift+S',
            click: this.onSaveProjectClick,
          },
          {
            label: 'Close project',
            click: this.onCloseProjectClick,
          },
          {
            type: 'separator',
          },
          {
            role: 'close',
          },
          ...(!isMac ? [
            {
              type: 'separator',
            },
            {
              role: 'quit',
            },
          ] : []),
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {
            role: 'copy',
          },
          {
            role: 'cut',
          },
          {
            role: 'paste',
          },
          {
            role: 'selectall',
          },
        ],
      },
      ...(isDev ? [
        {
          label: 'Dev',
          submenu: [
            {
              role: 'toggledevtools',
            },
            {
              type: 'separator',
            },
            {
              role: 'forcereload',
            },
            {
              type: 'separator',
            },
            {
              label: 'Reveal compiled scripts dir',
              click: this.onRevealCompiledScriptsDirClick,
            }
          ],
        }
      ] : []),
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  onRevealCompiledScriptsDirClick = () => {
    openExternalFolder(getCompiledScriptsDir());
  }

  onCreateProjectClick = () => {
    this.emit(MainMenuEvent.CREATE_PROJECT);
  }

  onOpenProjectClick = () => {
    this.emit(MainMenuEvent.OPEN_PROJECT);
  }

  onAboutClick = () => {
    this.emit(MainMenuEvent.ABOUT);
  }

  onSaveProjectClick = () => {
    this.emit(MainMenuEvent.SAVE_PROJECT);
  }

  onCloseProjectClick = () => {
    this.emit(MainMenuEvent.CLOSE_PROJECT);
  }

  static setEmpty() {
    const template = [
      { role: 'appMenu' },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  destroy() {
    MainMenu.setEmpty();
  }
}
