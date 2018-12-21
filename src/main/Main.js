import { app, powerSaveBlocker } from 'electron';
import { get, set, pick } from 'lodash';
import express from 'express';
import cors from 'cors';

import { createProjectDialog, openProjectDialog, warnBeforeClosingProject } from './ui/dialogs';
import { readAppConfig, writeAppConfig, createProject, writeJson, readJson } from './lib/fileSystem';
import MainWindow from './ui/MainWindow';
import MainMenu from './ui/MainMenu';
import * as MainWindowEvent from './events/MainWindowEvent';
import * as MainMenuEvent from './events/MainMenuEvent';
import * as StoreEvent from './events/StoreEvent';
import * as RendererEvent from './events/RendererEvent';
import Store from './data/Store';
import ScriptsManager from './data/ScriptsManager';
import { updateScripts } from '../common/js/store/actions/scripts';
import { updateDevices } from '../common/js/store/actions/devices';
import { updateTimelines } from '../common/js/store/actions/timelines';
import { updateTimelineInfo, updateTimelineInfoUser } from '../common/js/store/actions/timelineInfo';
import Renderer from './process/Renderer';

export default class Main {
  currentProjectFilePath = null;
  mainWindow = null;
  mainMenu = null
  store = null;
  renderer = null;
  expressApp = null;
  powerSaveBlockerId = null;
  
  constructor() {
    app.on('ready', this.onReady);
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('will-quit', this.onWillQuit);
    
    ScriptsManager.init();
  }
  
  onWindowAllClosed = () => {
    // Do nothing, keep the app alive
  }
  
  onReady = () => {
    this.createWebServer();
    this.createMainMenu();
    this.run();
  }
  
  onWillQuit = () => {
    // Better safe than sorry; destroy the renderer
    // on quit if it somehow survived
    this.destroyRenderer();
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
    
    this.createRenderer();
    this.createMainWindow();
  }
  
  createStore = (initialData = {}}) => {
    this.store = new Store(initialData);
    this.store.on(StoreEvent.SCRIPTS_CHANGED, this.onScriptsChanged);
    this.store.on(StoreEvent.PREVIEW_SCRIPT, this.onPreviewScript);
    this.store.on(StoreEvent.RUN_TIMELINE, this.onRunTimeline);
    this.store.on(StoreEvent.RUN_BOARD, this.onRunBoard);
    this.store.on(StoreEvent.TIMELINE_INFO_USER_CHANGED, this.onTimelineInfoUserChanged);
    this.store.on(StoreEvent.CONTENT_SAVED, this.onContentSaved);
  }
  
  destroyStore = () => {
    if (this.store) {
      this.store.removeAllListeners();
      this.store.destroy();
      this.store = null;
    }
  }
  
  onScriptsChanged = () => {
    const scripts = this.store.state.scripts;
    ScriptsManager.compileScripts(scripts);
  }
  
  onContentSaved = () => {
    console.log('onContentSaved');
    this.saveCurrentProject();
  }
  
  onPreviewScript = () => {
    if (this.renderer) {
      this.renderer.send({
        updateRenderer: this.store.state,
      });
    }
    
    this.updatePower();
  }
  
  onRunTimeline = () => {
    if (this.renderer) {
      this.renderer.send({
        updateRenderer: this.store.state,
      });
    }
    
    this.updatePower();
  }
  
  onRunBoard = () => {
    if (this.renderer) {
      this.renderer.send({
        updateRenderer: this.store.state,
      });
    }
    
    this.updatePower();
  }
  
  onTimelineInfoUserChanged = () => {
    const { timelineInfoUser } = this.store.state;
    if (this.renderer && timelineInfoUser !== null) {
      this.renderer.send({
        timelineInfo: timelineInfoUser,
      });
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
  
  createRenderer = () => {
    this.renderer = new Renderer();
    this.renderer.on(RendererEvent.TIMELINE_INFO_UPDATE, this.onRendererTimelineInfoUpdate);
  }
  
  onRendererTimelineInfoUpdate = (info) => {
    this.store.dispatch(updateTimelineInfo(info));
  }
  
  destroyRenderer = () => {
    if (this.renderer) {
      this.renderer.removeAllListeners();
      this.renderer.destroy();
      this.renderer = null;
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
    writeJson(this.currentProjectFilePath, pick(state, [
      'devices',
      'scripts',
      'timelines',
      'boards',
    ]));
  }
  
  closeCurrentProject = () => {
    this.destroyMainWindow();
    this.destroyStore();
    this.destroyRenderer();
    
    // const appConfig = readAppConfig();
    // set(appConfig, 'currentProjectFilePath', null);
    // writeAppConfig(appConfig);
    
    this.currentProjectFilePath = null;
  }
  
  createWebServer = () => {
    this.expressApp = express();
    this.expressApp.use(cors());
    // this.express.get('/timelines/:timelineId/blocks/:blockId/file', this.serveTimelineAudioTrack);
    this.expressApp.get('/current-timeline/blocks/:blockId/file', this.serveTimelineAudioTrack);
    
    const port = 5555;
    this.expressApp.listen(port, () => {
      console.log(`Web server started on port ${port}`);
    });
  }
  
  serveTimelineAudioTrack = (req, res, next) => {
    if (!this.store) {
      return next();
    }
    // const timelines = this.store.state.timelines;
    // const timeline = timelines.find(({id}) => id === req.params.timelineId);
    const timeline = this.store.state.currentTimeline;
    if (!timeline) {
      return res.status(404);
    }
    const block = timeline.items.find(({id}) => id === req.params.blockId);
    if (!block) {
      return res.status(404);
    }
    const file = block.file;
    if (!file) {
      return res.status(404);
    }
    res.sendFile(file);
  }
  
  updatePower = () => {
    const state = this.store.state;
    const shouldBlock = state.previewScript !== null || state.runTimeline !== null || state.runBoard !== null;

    if (shouldBlock) {
      if (this.powerSaveBlockerId === null) {
        console.log('start power block');
        this.powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension');
      }
    } else {
      if (this.powerSaveBlockerId !== null) {
        console.log('stop power block');
        powerSaveBlocker.stop(this.powerSaveBlockerId);
        this.powerSaveBlockerId = null;
      }
    }
  }
}