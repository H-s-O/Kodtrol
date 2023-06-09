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
  IPC_MAIN_CHANNEL_WARN_BEFORE_DELETE,
  IPC_MAIN_CHANNEL_QUIT,
} from '../common/constants';
import { createProjectDialog, openProjectDialog, warnBeforeClosingProject, warnBeforeDeleting } from './ui/dialogs';
import { cliProjectFile } from './lib/cli';
import { ok } from 'assert';

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
    ipcMain.handle(IPC_MAIN_CHANNEL_WARN_BEFORE_DELETE, this._requestedMessageBox.bind(this));

    if (cliProjectFile) {
      this._nextProjectFile = cliProjectFile;
    }

    this._uiLogicNext();
  }

  private _requestedQuit(event: IpcMainInvokeEvent): void {
    app.quit();
  }

  private _requestedCreateProject(event: IpcMainInvokeEvent): void {
    createProjectDialog(BrowserWindow.fromWebContents(event.sender))
      .then((result) => {
        if (result) {
          // @TODO file creation
          this._nextProjectFile = result;
          this._uiLogicNext();
        }
      });
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

  private _requestedMessageBox(event: IpcMainInvokeEvent, message: string, detail?: string): Promise<boolean> {
    return warnBeforeDeleting(message, detail, BrowserWindow.fromWebContents(event.sender));
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

  private _destroySplashWindow(softClose: boolean = true): void {
    if (this._splashWindow) {
      if (softClose) this._splashWindow.window.close();
      this._splashWindow.destroy();
      this._splashWindow = undefined;
    }
  }

  private _createEngineWindow(): void {
    this._engineWindow = new EngineWindow();
  }

  private _destroyEngineWindow(softClose: boolean = true): void {
    if (this._engineWindow) {
      if (softClose) this._engineWindow.window.close();
      this._engineWindow.destroy();
      this._engineWindow = undefined;
    }
  }

  private _createEditorWindow(): void {
    ok(this._currentProjectFile, '_currentProjectFile not set');

    this._editorWindow = new EditorWindow(this._currentProjectFile);
    this._editorWindow.window.on('close', this._onEditorWindowClose.bind(this));
  }

  private _onEditorWindowClose(event: Event): void {
    event.preventDefault();

    ok(this._editorWindow, '_editorWindow not set');

    warnBeforeClosingProject(this._editorWindow.window)
      .then((closeIt) => {
        if (closeIt) {
          this._nextProjectFile = undefined;
          this._uiLogicNext();
        }
      });
  }

  private _destroyEditorWindow(softClose: boolean = true): void {
    if (this._editorWindow) {
      this._editorWindow.window.off('close', this._onEditorWindowClose.bind(this));
      if (softClose) this._editorWindow.window.close();
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
