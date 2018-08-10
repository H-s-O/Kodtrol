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
            label: 'About...',
            click: this.onAboutClick,
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
            role: 'close',
          },
        ],
      },
    ];
    
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
}