import { app } from 'electron';
import { get, set } from 'lodash';

import { createProjectDialog, openProjectDialog, warnBeforeClosingProject } from './ui/dialogs';
import { readAppConfig, writeAppConfig, createProject, writeJson, readJson } from './lib/fileSystem';
import MainWindow from './ui/MainWindow';
import MainMenu from './ui/MainMenu';
import * as MainWindowEvent from './events/MainWindowEvent';
import * as MainMenuEvent from './events/MainMenuEvent';
import Store from './data/Store';
import ScriptsManager from './data/ScriptsManager';
import DevicesManager from './data/DevicesManager';
import TimelinesManager from './data/TimelinesManager';
import { updateScripts } from '../common/js/store/actions/scripts';
import { updateDevices } from '../common/js/store/actions/devices';
import { updateTimelines } from '../common/js/store/actions/timelines';

export default class Main {
  currentProjectFilePath = null;
  mainWindow = null;
  mainMenu = null
  store = null;
  
  constructor() {
    app.on('ready', this.onReady);
    app.on('window-all-closed', this.onWindowAllClosed);
    
    ScriptsManager.init();
    DevicesManager.init();
    TimelinesManager.init();
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
  }
  
  loadProject = (path, init = false) => {
    this.currentProjectFilePath = path;
    
    const appConfig = readAppConfig();
    set(appConfig, 'currentProjectFilePath', this.currentProjectFilePath);
    writeAppConfig(appConfig);
    
    if (init) {
      this.createStore();
    } else {
      const data = readJson(this.currentProjectFilePath);
      this.createStore(data);
    }
    
    this.createMainWindow();
    
    // DevicesManager.projectFilePath = this.currentProjectFilePath;
    // const devices = DevicesManager.listDevices().map(({id, name}) => ({
    //   id,
    //   name,
    // }));
    // this.store.dispatch(updateDevices(devices));
    // 
    // ScriptsManager.projectFilePath = this.currentProjectFilePath;
    // const scripts = ScriptsManager.listScripts().map(({id, name}) => ({
    //   id,
    //   name,
    //   current: id === 1,
    // }));
    // this.store.dispatch(updateScripts(scripts));
    // 
    // TimelinesManager.projectFilePath = this.currentProjectFilePath;
    // const timelines = TimelinesManager.listTimelines().map(({id, name}) => ({
    //   id,
    //   name,
    //   current: id === 1,
    // }));
    // this.store.dispatch(updateTimelines(timelines));
  }
  
  createStore = (initialData = null) => {
    this.store = new Store(initialData);
  }
  
  destroyStore = () => {
    if (this.store) {
      this.store.removeAllListeners();
      this.store.destroy();
      this.store = null;
    }
  }
  
  createMainWindow = () => {
    this.mainWindow = new MainWindow(`${app.getName()} — ${this.currentProjectFilePath}`);
    this.mainWindow.on(MainWindowEvent.CLOSING, this.onMainWindowClosing);
    this.mainWindow.once(MainWindowEvent.CLOSED, this.onMainWindowClosed);
  }
  
  onMainWindowClosing = (e) => {
    // const canClose = warnBeforeClosingProject(this.mainWindow.browserWindow);
    // if (!canClose) {
    //   e.preventDefault();
    // }
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
    this.mainMenu.on(MainMenuEvent.SAVE_PROJECT, this.saveCurrentProject);
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
    
    const finalPath = `${projectPath}.manuscrit`;
    
    this.loadProject(finalPath, true);
    this.saveCurrentProject();
  }
  
  saveCurrentProject = () => {
    const state = this.store.state;
    writeJson(this.currentProjectFilePath , state);
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