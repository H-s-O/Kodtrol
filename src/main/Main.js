import { app, powerSaveBlocker } from 'electron';
import { get, set, pick } from 'lodash';
import { join } from 'path';

import { createProjectDialog, openProjectDialog, warnBeforeClosingProject } from './ui/dialogs';
import { readAppConfig, writeAppConfig, createProject, writeJson, readJson, writeFile, ensureDir, getCompiledScriptsDir } from './lib/fileSystem';
import MainWindow from './ui/MainWindow';
import MainMenu from './ui/MainMenu';
import * as MainWindowEvent from './events/MainWindowEvent';
import * as MainMenuEvent from './events/MainMenuEvent';
import * as StoreEvent from './events/StoreEvent';
import * as RendererEvent from './events/RendererEvent';
import Store from './data/Store';
import { updateTimelineInfo } from '../common/js/store/actions/timelineInfo';
import { updateBoardInfo } from '../common/js/store/actions/boardInfo';
import { updateIOStatus } from '../common/js/store/actions/ioStatus';
import Renderer from './process/Renderer';
import { screenshotsFile, projectFile } from './lib/commandLine';
import compileScript from './lib/compileScript';

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

    // Make sure the destination dir for compiled scripts exists
    ensureDir(getCompiledScriptsDir());
  }

  get hasProjectOpened() {
    return this.currentProjectFilePath !== null;
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
    const project = projectFile();
    if (project !== null) {
      this.loadProject(project, false, false);
      return;
    }

    const configCurrentProject = readAppConfig('currentProjectFilePath');
    if (configCurrentProject) {
      this.loadProject(configCurrentProject);
    }
  }

  loadProject = (path, init = false, save = true) => {
    this.currentProjectFilePath = path;

    if (save) {
      const appConfig = readAppConfig();
      set(appConfig, 'currentProjectFilePath', this.currentProjectFilePath);
      writeAppConfig(appConfig);
    }

    if (init) {
      this.createStore();
    } else {
      const data = readJson(this.currentProjectFilePath);
      this.createStore(data);
    }

    this.createRenderer();
    this.createMainWindow();
  }

  createStore = (initialData = null) => {
    this.store = new Store(initialData);
    this.store.on(StoreEvent.OUTPUTS_CHANGED, this.onOutputsChanged);
    this.store.on(StoreEvent.INPUTS_CHANGED, this.onInputsChanged);
    this.store.on(StoreEvent.DEVICES_CHANGED, this.onDevicesChanged);
    this.store.on(StoreEvent.SCRIPTS_CHANGED, this.onScriptsChanged);
    this.store.on(StoreEvent.MEDIAS_CHANGED, this.onMediasChanged);
    this.store.on(StoreEvent.TIMELINES_CHANGED, this.onTimelinesChanged);
    this.store.on(StoreEvent.BOARDS_CHANGED, this.onBoardsChanged);
    this.store.on(StoreEvent.PREVIEW_SCRIPT, this.onPreviewScript);
    this.store.on(StoreEvent.RUN_TIMELINE, this.onRunTimeline);
    this.store.on(StoreEvent.RUN_BOARD, this.onRunBoard);
    this.store.on(StoreEvent.TIMELINE_INFO_USER_CHANGED, this.onTimelineInfoUserChanged);
    this.store.on(StoreEvent.BOARD_INFO_USER_CHANGED, this.onBoardInfoUserChanged);
    this.store.on(StoreEvent.CONTENT_SAVED, this.onContentSaved);
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

    scripts.forEach(script => {
      console.info('Compiling script', script.id, script.name);
      compileScript(script);
    })

    if (this.renderer) {
      console.log('updateScripts');
      this.renderer.send({
        updateScripts: scripts,
      });
    }
  }

  onMediasChanged = () => {
    const { medias } = this.store.state;

    if (this.renderer) {
      console.log('updateMedias');
      this.renderer.send({
        updateMedias: medias,
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
    this.saveProject();
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
    this.mainWindow.on(MainWindowEvent.LOADED, this.onMainWindowLoaded);
  }

  destroyMainWindow = () => {
    if (this.mainWindow) {
      this.mainWindow.removeAllListeners();
      this.mainWindow.destroy();
      this.mainWindow = null;
    }
  }

  onMainWindowClosing = () => {
    this.doCloseProjectWarn();
  }

  onMainWindowLoaded = () => {
    // Check if we are in the "generate screenshots" mode
    const screenshots = screenshotsFile();
    if (screenshots !== null) {
      const { default: data } = require(screenshots);
      this.generateScreenshots(data);
    }
  }

  createRenderer = () => {
    this.renderer = new Renderer();
    this.renderer.on(RendererEvent.READY, this.onRendererReady);
    this.renderer.on(RendererEvent.TIMELINE_INFO_UPDATE, this.onRendererTimelineInfoUpdate);
    this.renderer.on(RendererEvent.BOARD_INFO_UPDATE, this.onRendererBoardInfoUpdate);
    this.renderer.on(RendererEvent.IO_STATUS_UPDATE, this.onRendererIOStatusUpdate);
  }

  destroyRenderer = () => {
    if (this.renderer) {
      this.renderer.removeAllListeners();
      this.renderer.destroy();
      this.renderer = null;
    }
  }

  onRendererReady = () => {
    // Force an initial data update to the renderer
    this.onOutputsChanged();
    this.onInputsChanged();
    this.onDevicesChanged();
    this.onScriptsChanged();
    this.onMediasChanged();
    this.onTimelinesChanged();
    this.onBoardsChanged();
  }

  onRendererTimelineInfoUpdate = (info) => {
    this.store.dispatch(updateTimelineInfo(info));
  }

  onRendererBoardInfoUpdate = (info) => {
    this.store.dispatch(updateBoardInfo(info));
  }

  onRendererIOStatusUpdate = (status) => {
    this.store.dispatch(updateIOStatus(status));
  }

  createMainMenu = () => {
    this.mainMenu = new MainMenu();
    this.mainMenu.on(MainMenuEvent.OPEN_PROJECT, this.onMainMenuOpenProject);
    this.mainMenu.on(MainMenuEvent.CREATE_PROJECT, this.onMainMenuCreateProject);
    this.mainMenu.on(MainMenuEvent.SAVE_PROJECT, this.onMainMenuSaveProject);
    this.mainMenu.on(MainMenuEvent.CLOSE_PROJECT, this.onMainMenuCloseProject);
  }

  onMainMenuOpenProject = () => {
    if (this.hasProjectOpened) {
      this.doCloseProjectWarn(this.selectProjectToOpen);
    } else {
      this.selectProjectToOpen();
    }
  }

  selectProjectToOpen = () => {
    const projectPath = openProjectDialog();
    if (projectPath !== null) {
      this.loadProject(projectPath);
    }
  }

  onMainMenuCreateProject = () => {
    if (this.hasProjectOpened) {
      this.doCloseProjectWarn(this.createProject);
    } else {
      this.createProject();
    }
  }

  onMainMenuSaveProject = () => {
    this.saveProject();
  }

  onMainMenuCloseProject = () => {
    this.doCloseProjectWarn();
  }

  createProject = () => {
    const projectPath = createProjectDialog();
    if (projectPath !== null) {
      const finalPath = `${projectPath}.manuscrit`;

      this.loadProject(finalPath, true);
      this.saveProject();
    }
  }

  saveProject = () => {
    const state = this.store.state;
    writeJson(this.currentProjectFilePath, pick(state, [
      'fileVersion',
      'devices',
      'scripts',
      'medias',
      'timelines',
      'boards',
      'outputs',
      'inputs',
    ]));
  }

  doCloseProjectWarn = (next) => {
    if (this.hasProjectOpened) {
      const canClose = warnBeforeClosingProject(this.mainWindow.browserWindow);
      if (canClose) {
        this.closeProject();
        if (typeof next === 'function') {
          next();
        }
      }
    } else {
      if (typeof next === 'function') {
        next();
      }
    }
  }

  closeProject = () => {
    this.destroyMainWindow();
    this.destroyStore();
    this.destroyRenderer();

    const appConfig = readAppConfig();
    set(appConfig, 'currentProjectFilePath', null);
    writeAppConfig(appConfig);

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

  generateScreenshots = (data) => {
    const dir = './dev/screenshots/';
    ensureDir(dir);

    data.forEach(async ({ selector, file, dispatchIn, dispatchOut }) => {
      try {
        if (dispatchIn) {
          await new Promise((resolve, reject) => {
            this.store.dispatch(dispatchIn);
            setTimeout(resolve, 1500);
          });
        }

        await new Promise((resolve, reject) => {
          this.mainWindow.capture(selector, (err, image) => {
            if (err) {
              reject(err);
              return;
            }
            const pngData = image.toPNG();
            const filePath = join(dir, file);
            writeFile(filePath, pngData);
            console.info(`Generated screenshot for ${selector} to file ${filePath}`);
            resolve();
          });
        });

        if (dispatchOut) {
          await new Promise((resolve, reject) => {
            this.store.dispatch(dispatchOut);
            setTimeout(resolve, 1500);
          });
        }
      } catch (e) {
        console.error(`Error while generating screenshot for ${selector} : ${e}`);
      }
    });
  }
}