import { app, powerSaveBlocker, BrowserWindow } from 'electron';
import { set, pick } from 'lodash';
import { join } from 'path';

import { createProjectDialog, openProjectDialog, warnBeforeClosingProject } from './ui/dialogs';
import { readAppConfig, writeAppConfig, writeJson, readJson, writeFile, ensureDir, getCompiledScriptsDir } from './lib/fileSystem';
import MainWindow from './ui/MainWindow';
import MainMenu from './ui/MainMenu';
import * as MainWindowEvent from './events/MainWindowEvent';
import * as ConsoleWindowEvent from './events/ConsoleWindowEvent';
import * as MainMenuEvent from './events/MainMenuEvent';
import * as StoreEvent from './events/StoreEvent';
import * as RendererEvent from './events/RendererEvent';
import * as WatcherEvent from './events/WatcherEvent';
import Store from './data/Store';
import { updateIOStatusAction } from '../common/js/store/actions/ioStatus';
import Renderer from './process/Renderer';
import { screenshotsFile, projectFile } from './lib/commandLine';
import compileScript from './lib/compileScript';
import { PROJECT_FILE_EXTENSION } from '../common/js/constants/app';
import { ipcMainListen, ipcMainClear } from './lib/ipcMain';
import { UPDATE_TIMELINE_INFO, UPDATE_BOARD_INFO, SCRIPT_ERROR, SCRIPT_LOG } from '../common/js/constants/events';
import MidiWatcher from './lib/watchers/MidiWatcher';
import { updateIOAvailableAction } from '../common/js/store/actions/ioAvailable';
import { IO_MIDI, IO_INPUT, IO_OUTPUT } from '../common/js/constants/io';
import isDev from '../common/js/lib/isDev';
import ConsoleWindow from './ui/ConsoleWindow';
import { setConsoleClosedAction } from '../common/js/store/actions/console';

export default class Main {
  currentProjectFilePath = null;
  mainWindow = null;
  consoleWindow = null;
  mainMenu = null
  store = null;
  renderer = null;
  powerSaveBlockerId = null;
  midiWatcher = null;

  static _devExtensionsLoaded = false;

  constructor() {
    app.allowRendererProcessReuse = false;

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
    this.loadDevExtensions();
    this.createMainMenu();
    this.createWatchers();
    this.run();
  }

  onWillQuit = () => {
    // Better safe than sorry; destroy the renderer
    // on quit if it somehow survived
    this.destroyRenderer();
  }

  loadDevExtensions = () => {
    if (isDev && !Main._devExtensionsLoaded) {
      BrowserWindow.addDevToolsExtension(join(__dirname, '../../dev/extensions/fmkadmapgofadopljbjfkapdkoienihi/4.7.0_0'));
      BrowserWindow.addDevToolsExtension(join(__dirname, '../../dev/extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0'));
      Main._devExtensionsLoaded = true;
    }
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
    this.createConsoleWindow();
    this.setupEventListeners();
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
    this.store.on(StoreEvent.RUN_DEVICE, this.onRunDevice);
    this.store.on(StoreEvent.RUN_SCRIPT, this.onRunScript);
    this.store.on(StoreEvent.RUN_TIMELINE, this.onRunTimeline);
    this.store.on(StoreEvent.RUN_BOARD, this.onRunBoard);
    this.store.on(StoreEvent.CONTENT_SAVED, this.onContentSaved);
    this.store.on(StoreEvent.CONSOLE_CHANGED, this.onConsoleChanged);
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

  onConsoleChanged = () => {
    if (this.consoleWindow) {
      this.consoleWindow.setVisible(this.store.state.console);
    }
  }

  onRunDevice = () => {
    const { runDevice } = this.store.state;

    if (this.renderer) {
      this.renderer.send({
        runDevice,
      });
    }

    this.updatePower();
  }

  onRunScript = () => {
    const { runScript } = this.store.state;

    if (this.renderer) {
      this.renderer.send({
        runScript,
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

  createMainWindow = () => {
    this.mainWindow = new MainWindow(this.currentProjectFilePath);
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

  createConsoleWindow = () => {
    this.consoleWindow = new ConsoleWindow();
    this.consoleWindow.on(ConsoleWindowEvent.CLOSING, this.onConsoleWindowClosing);
  }

  onConsoleWindowClosing = () => {
    this.store.dispatch(setConsoleClosedAction());
  }

  destroyConsoleWindow = () => {
    if (this.consoleWindow) {
      this.consoleWindow.removeAllListeners();
      this.consoleWindow.destroy();
      this.consoleWindow = null;
    }
  }

  setupEventListeners = () => {
    ipcMainListen(UPDATE_TIMELINE_INFO, this.onUpdateTimelineInfo)
    ipcMainListen(UPDATE_BOARD_INFO, this.onUpdateBoardInfo)
  }

  removeEventListeners = () => {
    ipcMainClear();
  }

  onUpdateTimelineInfo = (event, data) => {
    if (this.renderer) {
      this.renderer.send({
        updateTimelineInfo: data,
      });
    }
  }

  onUpdateBoardInfo = (event, data) => {
    if (this.renderer) {
      this.renderer.send({
        updateBoardInfo: data,
      });
    }
  }

  createRenderer = () => {
    this.renderer = new Renderer();
    this.renderer.on(RendererEvent.READY, this.onRendererReady);
    this.renderer.on(RendererEvent.TIMELINE_INFO_UPDATE, this.onRendererTimelineInfoUpdate);
    this.renderer.on(RendererEvent.BOARD_INFO_UPDATE, this.onRendererBoardInfoUpdate);
    this.renderer.on(RendererEvent.IO_STATUS_UPDATE, this.onRendererIOStatusUpdate);
    this.renderer.on(RendererEvent.SCRIPT_ERROR, this.onRendererScriptError);
    this.renderer.on(RendererEvent.SCRIPT_LOG, this.onRendererScriptLog);
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
    if (this.mainWindow) {
      this.mainWindow.send(UPDATE_TIMELINE_INFO, info);
    }
  }

  onRendererBoardInfoUpdate = (info) => {
    if (this.mainWindow) {
      this.mainWindow.send(UPDATE_BOARD_INFO, info);
    }
  }

  onRendererIOStatusUpdate = (status) => {
    if (this.store) {
      this.store.dispatch(updateIOStatusAction(status));
    }
  }

  onRendererScriptError = (info) => {
    if (this.mainWindow) {
      this.mainWindow.send(SCRIPT_ERROR, info);
    }
  }

  onRendererScriptLog = (data) => {
    if (this.consoleWindow) {
      this.consoleWindow.send(SCRIPT_LOG, data);
    }
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

  createWatchers = () => {
    this.midiWatcher = new MidiWatcher();
    this.midiWatcher.on(WatcherEvent.UPDATE, this.onMidiWatcherUpdate);
  }

  onMidiWatcherUpdate = (inputs, outputs) => {
    if (this.store) {
      const ioAvailable = this.store.state.ioAvailable;
      const newList = [
        ...ioAvailable.filter(({ type }) => type !== IO_MIDI),
        ...inputs.map((input) => ({ ...input, type: IO_MIDI, mode: IO_INPUT })),
        ...outputs.map((output) => ({ ...output, type: IO_MIDI, mode: IO_OUTPUT })),
      ];
      this.store.dispatch(updateIOAvailableAction(newList));
    }
  }

  createProject = () => {
    const projectPath = createProjectDialog();
    if (projectPath !== null) {
      const finalPath = `${projectPath}.${PROJECT_FILE_EXTENSION}`;

      this.loadProject(finalPath, true);
      this.saveProject();
    }
  }

  saveProject = () => {
    const state = this.store.state;
    writeJson(this.currentProjectFilePath, pick(state, [
      'fileVersion',
      'devices',
      'devicesFolders',
      'scripts',
      'scriptsFolders',
      'editScripts',
      'medias',
      'mediasFolders',
      'timelines',
      'timelinesFolders',
      'editTimelines',
      'boards',
      'boardsFolders',
      'editBoards',
      'outputs',
      'inputs',
      'lastEditor',
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
    this.removeEventListeners();
    this.destroyConsoleWindow();
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
    const shouldBlock = state.runDevice !== null || state.runScript !== null || state.runTimeline !== null || state.runBoard !== null;

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

  generateScreenshots = async (data) => {
    console.info('=== Begin generating screenshots... ===');

    const dir = './dev/screenshots/';
    ensureDir(dir);

    for (let i = 0; i < data.length; i++) {
      const { selector, file, dispatchIn, dispatchOut } = data[i];

      console.info(`Generating screenshot for ${selector}`);

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
            console.info(`Success: ${filePath}`);
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
        console.error(`Error: ${e}`);
      }
    }

    console.info('=== Screenshots generation complete! ===');
  }
}
