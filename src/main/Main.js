import { app, powerSaveBlocker } from 'electron';
import { get, set, pick } from 'lodash';

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
import { updateTimelineInfo } from '../common/js/store/actions/timelineInfo';
import { updateBoardInfo } from '../common/js/store/actions/boardInfo';
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
    
    this.createRenderer();
    
    if (init) {
      this.createStore();
    } else {
      const data = readJson(this.currentProjectFilePath);
      this.createStore(data);
    }
    
    this.createMainWindow();
  }
  
  createStore = (initialData = null) => {
    this.store = new Store(initialData);
    this.store.on(StoreEvent.OUTPUTS_CHANGED, this.onOutputsChanged);
    this.store.on(StoreEvent.INPUTS_CHANGED, this.onInputsChanged);
    this.store.on(StoreEvent.DEVICES_CHANGED, this.onDevicesChanged);
    this.store.on(StoreEvent.SCRIPTS_CHANGED, this.onScriptsChanged);
    this.store.on(StoreEvent.TIMELINES_CHANGED, this.onTimelinesChanged);
    this.store.on(StoreEvent.BOARDS_CHANGED, this.onBoardsChanged);
    this.store.on(StoreEvent.PREVIEW_SCRIPT, this.onPreviewScript);
    this.store.on(StoreEvent.RUN_TIMELINE, this.onRunTimeline);
    this.store.on(StoreEvent.RUN_BOARD, this.onRunBoard);
    this.store.on(StoreEvent.TIMELINE_INFO_USER_CHANGED, this.onTimelineInfoUserChanged);
    this.store.on(StoreEvent.BOARD_INFO_USER_CHANGED, this.onBoardInfoUserChanged);
    this.store.on(StoreEvent.CONTENT_SAVED, this.onContentSaved);
    
    // Force an initial update
    // @TODO somehow trigger directly in the store ?
    this.onOutputsChanged();
    this.onInputsChanged();
    this.onDevicesChanged();
    this.onScriptsChanged();
    this.onTimelinesChanged();
    this.onBoardsChanged();
  }
  
  destroyStore = () => {
    if (this.store) {
      this.store.removeAllListeners();
      this.store.destroy();
      this.store = null;
    }
  }
  
  onOutputsChanged = () => {
    const { outputs } = this.store.state;
    
    if (this.renderer) {
      console.log('updateOutputs');
      this.renderer.send({
        updateOutputs: outputs,
      });
    }
  }
  
  onInputsChanged = () => {
    const { inputs } = this.store.state;
    
    if (this.renderer) {
      console.log('updateInputs');
      this.renderer.send({
        updateInputs: inputs,
      });
    }
  }
  
  onDevicesChanged = () => {
    const { devices } = this.store.state;
    
    if (this.renderer) {
      console.log('updateDevices');
      this.renderer.send({
        updateDevices: devices,
      });
    }
  }
  
  onScriptsChanged = () => {
    const { scripts } = this.store.state;
    ScriptsManager.compileScripts(scripts);
    
    if (this.renderer) {
      console.log('updateScripts');
      this.renderer.send({
        updateScripts: scripts,
      });
    }
  }
  
  onTimelinesChanged = () => {
    const { timelines } = this.store.state;
    
    if (this.renderer) {
      console.log('updateTimelines');
      this.renderer.send({
        updateTimelines: timelines,
      });
    }
  }
  
  onBoardsChanged = () => {
    const { boards } = this.store.state;
    
    if (this.renderer) {
      console.log('updateBoards');
      this.renderer.send({
        updateBoards: boards,
      });
    }
  }
  
  onContentSaved = () => {
    console.log('onContentSaved');
    this.saveCurrentProject();
  }
  
  onPreviewScript = () => {
    const { previewScript } = this.store.state;
    
    if (this.renderer) {
      this.renderer.send({
        previewScript,
      });
    }
    
    this.updatePower();
  }
  
  onRunTimeline = () => {
    const { runTimeline } = this.store.state;
    
    if (this.renderer) {
      this.renderer.send({
        runTimeline,
      });
    }
    
    this.updatePower();
  }
  
  onRunBoard = () => {
    const { runBoard } = this.store.state;
    
    if (this.renderer) {
      this.renderer.send({
        runBoard,
      });
    }
    
    this.updatePower();
  }
  
  onTimelineInfoUserChanged = () => {
    const { timelineInfoUser } = this.store.state;
    
    if (this.renderer && timelineInfoUser !== null) {
      this.renderer.send({
        timelineInfoUser,
      });
    }
  }
  
  onBoardInfoUserChanged = () => {
    const { boardInfoUser } = this.store.state;
    
    if (this.renderer && boardInfoUser !== null) {
      this.renderer.send({
        boardInfoUser,
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
    this.renderer.on(RendererEvent.BOARD_INFO_UPDATE, this.onRendererBoardInfoUpdate);
  }
  
  onRendererTimelineInfoUpdate = (info) => {
    this.store.dispatch(updateTimelineInfo(info));
  }
  
  onRendererBoardInfoUpdate = (info) => {
    this.store.dispatch(updateBoardInfo(info));
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
      this.destroyMainWindow();
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
      'fileVersion',
      'devices',
      'scripts',
      'timelines',
      'boards',
      'outputs',
      'inputs',
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