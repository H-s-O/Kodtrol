import { MenuItemConstructorOptions } from 'electron'

import BaseWindow from './BaseWindow'

class EditorWindow extends BaseWindow {
  constructor() {
    super({
      id: 'editorwindow',
      defaultWidth: 1600,
      defaultHeight: 900,
    })
  }

  protected _generateMenu(): MenuItemConstructorOptions[] {
    return []
  }
}

export default EditorWindow
