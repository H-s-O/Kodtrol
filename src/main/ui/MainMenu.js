import EventEmitter from 'events';
import { app, Menu } from 'electron';

import * as MainMenuEvent from '../events/MainMenuEvent';

export default class MainMenu extends EventEmitter {
  constructor() {
    super();
    
    const template = [
      {
        label: app.getName(),
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
      {
        label: 'File',
        submenu: [
          {
            label: 'Create project...',
            click: this.onCreateProjectClick,
          },
          {
            label: 'Open project...',
            click: this.onOpenProjectClick,
          },
          {
            type: 'separator',
          },
          {
            label: 'Save project',
            accelerator: 'CommandOrControl+S',
            click: this.onSaveProjectClick,
          },
          {
            type: 'separator',
          },
          {
            role: 'close',
          },
        ],
      },
    ];
    
    const isDev = true;
    if (isDev) {
      template.push({
        label: 'Dev',
        submenu: [
          {
            role: 'toggledevtools',
          },
          {
            type: 'separator',
          },
          {
            role: 'reload',
          },
          {
            role: 'forcereload',
          },
        ],
      })
    }
    
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
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
}