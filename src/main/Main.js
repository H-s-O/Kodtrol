import { app } from 'electron';
import { get, set } from 'lodash';

import { createProjectDialog, openProjectDialog, warnBeforeClosingProject } from './ui/dialogs';
import { readAppConfig, writeAppConfig, createProject } from './lib/fileSystem';
import MainWindow from './ui/MainWindow';
import MainMenu from './ui/MainMenu';
import * as MainWindowEvent from './events/MainWindowEvent';
import * as MainMenuEvent from './events/MainMenuEvent';
import Store from './data/Store';

export default class Main {
  currentProjectFilePath = null;
  mainWindow = null;
  mainMenu = null
  store = null;
  
  constructor() {
    app.on('ready', this.onReady);
    app.on('window-all-closed', this.onWindowAllClosed);
  }
  
  onWindowAllClosed = () => {
    // do nothing, keep the app alive
  }
  
  onReady = () => {
    this.createMainMenu();
    this.run();
  }
  
  run = () => {
    const appConfig = readAppConfig();
    const configCurrentProject = get(appConfig, 'currentProjectFilePath');
    if (!configCurrentProject) {
      return;
    }
    
    this.loadProject(configCurrentProject);

    // ScriptsManager.projectFilePath = currentProjectFilePath;
    // DevicesManager.projectFilePath = currentProjectFilePath;
    // TimelinesManager.projectFilePath = currentProjectFilePath;

  }
  
  loadProject = (path) => {
    this.currentProjectFilePath = path;
    
    const appConfig = readAppConfig();
    set(appConfig, 'currentProjectFilePath', this.currentProjectFilePath);
    writeAppConfig(appConfig);
    
    this.createStore();
    this.createMainWindow();
  }
  
  createStore = () => {
    this.store = new Store();
  }
  
  destroyStore = () => {
    if (this.store) {
      this.store.removeAllListeners();
      this.store.destroy();
      this.store = null;
    }
  }
  
  createMainWindow = () => {
    this.mainWindow = new MainWindow(`${app.getName()} -- ${this.currentProjectFilePath}`);
    this.mainWindow.on(MainWindowEvent.CLOSING, this.onMainWindowClosing);
    this.mainWindow.once(MainWindowEvent.CLOSED, this.onMainWindowClosed);
  }
  
  onMainWindowClosing = (e) => {
    const canClose = warnBeforeClosingProject(this.mainWindow.browserWindow);
    if (!canClose) {
      e.preventDefault();
    }
  }
  
  onMainWindowClosed = () => {
    this.closeCurrentProject();
  }
  
  destroyMainWindow = () => {
    if (this.mainWindow) {
      this.mainWindow.removeAllListeners();
      this.mainWindow.destroy();
      this.mainWindow = null;
    }
  }
  
  createMainMenu = () => {
    this.mainMenu = new MainMenu();
    this.mainMenu.on(MainMenuEvent.OPEN_PROJECT, this.openProject);
    this.mainMenu.on(MainMenuEvent.CREATE_PROJECT, this.createProject);
  }
  
  openProject = () => {
    if (this.mainWindow) {
      this.mainWindow.close();
    }
    
    const projectPath = openProjectDialog();
    if (!projectPath) {
      return;
    }
    
    this.loadProject(projectPath);
  }
  
  createProject = () => {
    if (this.mainWindow) {
      this.mainWindow.close();
    }
    
    const projectPath = createProjectDialog();
    if (!projectPath) {
      return;
    }
    
    const finalPath = createProject(projectPath);
    
    this.loadProject(finalPath);
  }
  
  closeCurrentProject = () => {
    this.destroyMainWindow();
    this.destroyStore();
    
    // const appConfig = readAppConfig();
    // set(appConfig, 'currentProjectFilePath', null);
    // writeAppConfig(appConfig);
    
    this.currentProjectFilePath = null;
  }
}