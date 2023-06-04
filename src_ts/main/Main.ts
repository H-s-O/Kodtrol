import { BrowserWindow, Event, IpcMainInvokeEvent, app, ipcMain } from 'electron';
import { join } from 'path';
import { nextTick } from 'process';

import SplashWindow from './ui/SplashWindow';
import EditorWindow from './ui/EditorWindow';
import EngineWindow from './ui/EngineWindows';
import {
  APP_NAME,
  IPC_MAIN_CHANNEL_CREATE_PROJECT,
  IPC_MAIN_CHANNEL_LOAD_PROJECT,
  IPC_MAIN_CHANNEL_QUIT,
} from '../common/constants';
import { createProjectDialog, openProjectDialog, warnBeforeClosingProject } from './ui/dialogs';

class Main {
  private _splashWindow?: SplashWindow;
  private _editorWindow?: EditorWindow;
  private _engineWindow?: EngineWindow;
  private _currentProjectFile?: string;
  private _nextProjectFile?: string;

  constructor() {
    app.setName(APP_NAME);

    app.once('ready', this._onAppReady.bind(this));
    app.once('will-quit', this._onWillQuit.bind(this));
  }

  private _onAppReady(): void {
    ipcMain.handle(IPC_MAIN_CHANNEL_QUIT, this._requestedQuit.bind(this));
    ipcMain.handle(IPC_MAIN_CHANNEL_CREATE_PROJECT, this._requestedCreateProject.bind(this));
    ipcMain.handle(IPC_MAIN_CHANNEL_LOAD_PROJECT, this._requestedLoadProject.bind(this));

    this._uiLogicNext();
  }

  private _requestedQuit(event: IpcMainInvokeEvent): void {
    app.quit();
  }

  private _requestedCreateProject(event: IpcMainInvokeEvent): void {
    console.log('create project');
  }

  private _requestedLoadProject(event: IpcMainInvokeEvent): void {
    openProjectDialog(BrowserWindow.fromWebContents(event.sender))
      .then((result) => {
        if (result) {
          this._nextProjectFile = result;
          this._uiLogicNext();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private _uiLogicNext(): void {
    nextTick(this._uiLogic.bind(this));
  }

  private _uiLogic(): void {
    console.debug('_uiLogic()', 'curr:', this._currentProjectFile, 'next:', this._nextProjectFile);

    if (this._nextProjectFile) {
      // Awaiting opening a project
      if (this._currentProjectFile) {
        // Closing current project
        this._destroyEditorWindow();
        this._destroyEngineWindow();
        this._destroySplashWindow();

        this._currentProjectFile = undefined;

        this._uiLogicNext();

        return;
      } else {
        // Opening awaiting project and switch it to current project
        this._currentProjectFile = this._nextProjectFile;
        this._nextProjectFile = undefined;

        this._createEditorWindow();
        this._createEngineWindow();

        this._destroySplashWindow();

        return;
      }
    }

    // There is no awaiting project
    this._createSplashWindow();

    this._destroyEditorWindow();
    this._destroyEngineWindow();
  }

  private _createSplashWindow(): void {
    this._splashWindow = new SplashWindow();
  }

  private _destroySplashWindow(): void {
    if (this._splashWindow) {
      this._splashWindow.removeAllListeners();
      this._splashWindow.destroy();
      this._splashWindow = undefined;
    }
  }

  private _createEngineWindow(): void {
    this._engineWindow = new EngineWindow();
  }

  private _destroyEngineWindow(): void {
    if (this._engineWindow) {
      this._engineWindow.removeAllListeners();
      this._engineWindow.destroy();
      this._engineWindow = undefined;
    }
  }

  private _createEditorWindow(): void {
    this._editorWindow = new EditorWindow();
    this._editorWindow.on('close', this._onEditorWindowClose.bind(this));
  }

  private _onEditorWindowClose(event: Event): void {
    event.preventDefault();

    warnBeforeClosingProject(this._editorWindow)
      .then((closeIt) => {
        if (closeIt) {
          this._nextProjectFile = undefined;
          this._uiLogicNext();
        }
      });
  }

  private _destroyEditorWindow(): void {
    if (this._editorWindow) {
      this._editorWindow.removeAllListeners();
      this._editorWindow.destroy();
      this._editorWindow = undefined;
    }
  }

  private _onWillQuit(): void {
    ipcMain.removeHandler(IPC_MAIN_CHANNEL_QUIT);
    ipcMain.removeHandler(IPC_MAIN_CHANNEL_CREATE_PROJECT);
    ipcMain.removeHandler(IPC_MAIN_CHANNEL_LOAD_PROJECT);

    console.info('now quitting');
  }
}

export default Main;
