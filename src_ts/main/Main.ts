import {
  BrowserWindow,
  Event,
  IpcMainInvokeEvent,
  app,
  ipcMain,
  MessageChannelMain,
} from 'electron/main';
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
  IPC_MAIN_CHANNEL_WARN_BEFORE_CLOSE,
} from '../common/constants';
import { createProjectDialog, openProjectDialog, warnBeforeClosing, warnBeforeClosingProject, warnBeforeDeleting } from './ui/dialogs';
import { cliProjectFile } from './lib/cli';
import { ok } from 'assert';

class Main {
  private _splashWindow?: SplashWindow;
  private _editorWindow?: EditorWindow;
  private _engineWindow?: EngineWindow;
  private _currentProjectFile?: string;
  private _nextProjectFile?: string;
  private _messageChannelMain?: MessageChannelMain;

  constructor() {
    app.setName(APP_NAME);

    app.once('ready', this._onAppReady.bind(this));
    app.once('will-quit', this._onWillQuit.bind(this));
  }

  private _onAppReady(): void {
    ipcMain.handle(IPC_MAIN_CHANNEL_QUIT, this._requestedQuit.bind(this));
    ipcMain.handle(IPC_MAIN_CHANNEL_CREATE_PROJECT, this._requestedCreateProject.bind(this));
    ipcMain.handle(IPC_MAIN_CHANNEL_LOAD_PROJECT, this._requestedLoadProject.bind(this));
    ipcMain.handle(IPC_MAIN_CHANNEL_WARN_BEFORE_DELETE, this._requestedWarnBeforeDelete.bind(this));
    ipcMain.handle(IPC_MAIN_CHANNEL_WARN_BEFORE_CLOSE, this._requestedWarnBeforeClose.bind(this));

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

  private _requestedWarnBeforeClose(event: IpcMainInvokeEvent, message: string, detail?: string): Promise<boolean> {
    return warnBeforeClosing(message, detail, BrowserWindow.fromWebContents(event.sender));
  }

  private _requestedWarnBeforeDelete(event: IpcMainInvokeEvent, message: string, detail?: string): Promise<boolean> {
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
        this._destroyMessageChannel();

        this._currentProjectFile = undefined;

        this._uiLogicNext();

        return;
      } else {
        // Opening awaiting project and switch it to current project
        this._currentProjectFile = this._nextProjectFile;
        this._nextProjectFile = undefined;

        this._createMessageChannel();
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
    ok(this._messageChannelMain, '_messageChannelMain not set');

    this._engineWindow = new EngineWindow(this._messageChannelMain.port2);
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
    ok(this._messageChannelMain, '_messageChannelMain not set');

    this._editorWindow = new EditorWindow(this._currentProjectFile, this._messageChannelMain.port1);
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

  private _createMessageChannel(): void {
    this._messageChannelMain = new MessageChannelMain();
    this._messageChannelMain.port1.on('message', (e) => console.log('Main port1', e.data)); //temp
    this._messageChannelMain.port2.on('message', (e) => console.log('Main port2', e.data)); //temp
    this._messageChannelMain.port1.start();
    this._messageChannelMain.port2.start();
  }

  private _destroyMessageChannel(): void {
    this._messageChannelMain = undefined;
  }

  private _onWillQuit(): void {
    ipcMain.removeHandler(IPC_MAIN_CHANNEL_QUIT);
    ipcMain.removeHandler(IPC_MAIN_CHANNEL_CREATE_PROJECT);
    ipcMain.removeHandler(IPC_MAIN_CHANNEL_LOAD_PROJECT);
    ipcMain.removeHandler(IPC_MAIN_CHANNEL_WARN_BEFORE_DELETE);
    ipcMain.removeHandler(IPC_MAIN_CHANNEL_WARN_BEFORE_CLOSE);

    console.info('now quitting');
  }
}

export default Main;
