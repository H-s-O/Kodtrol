import { app } from 'electron'
import { join } from 'path'
import { nextTick } from 'process'

import SplashWindow from './ui/SplashWindow'
import EditorWindow from './ui/EditorWindow'
import EngineWindow from './ui/EngineWindows'

class Main {
  private _splashWindow?: SplashWindow
  private _editorWindow?: EditorWindow
  private _engineWindow?: EngineWindow
  private _currentProjectFile?: string

  constructor() {
    app.once('ready', this._onAppReady.bind(this))
    app.once('will-quit', this._onWillQuit.bind(this))
  }

  private _onAppReady(): void {
    nextTick(this._uiLogic.bind(this))
  }

  private _uiLogic(): void {
    // Is there an active project file opened?
    if (!this._currentProjectFile) {
      // Open the splash window
      this._createSplashWindow()
    } else {
      
    }
  }

  private _createSplashWindow(): void {
    this._splashWindow = new SplashWindow()
  }

  private _destroySplashWindow(): void {
    if (this._splashWindow) {
      this._splashWindow.removeAllListeners()
      this._splashWindow.destroy()
      this._splashWindow = undefined
    }
  }

  private _createEngineWindow(): void {
    this._engineWindow = new EngineWindow()
  }

  private _destroyEngineWindow(): void {
    if (this._engineWindow) {
      this._engineWindow.removeAllListeners()
      this._engineWindow.destroy()
      this._engineWindow = undefined
    }
  }

  private _createEditorWindow(): void {
    this._editorWindow = new EditorWindow()
  }

  private _destroyEditorWindow(): void {
    if (this._editorWindow) {
      this._editorWindow.removeAllListeners()
      this._editorWindow.destroy()
      this._editorWindow = undefined
    }
  }

  private _onWillQuit(): void {
    console.info('now quitting')
  }
}

export default Main
