import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import ScriptsManager from './main/ScriptsManager';
import MainRenderer from './main/MainRenderer';

ScriptsManager.init();

const mainRenderer = new MainRenderer();

let currentScript = null;

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win

  function createWindow () {
    BrowserWindow.addDevToolsExtension('/Users/hugo/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.1.0_0')

    // Create the browser window.
    win = new BrowserWindow({width: 1200, height: 900})
    // and load the index.html of the app.
    // win.loadURL(url.format({
    //   pathname: path.join(__dirname, '../dist/ui/index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }))
    win.loadURL('http://localhost:8080/');
    const contents = win.webContents;
    contents.on('did-finish-load', () => {
      const scripts = ScriptsManager.listScripts().map((script) => ({
        name: script,
      }));
      console.log(scripts);
      // setInterval(() => {
        contents.send('updateScripts', scripts);
      // }, 1000);
    });

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform !== 'darwin') {
      app.quit()
    // }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.

  ipcMain.on('saveScript', (evt, arg) => {
    const scriptPath = ScriptsManager.saveScript(currentScript, arg);
    mainRenderer.reloadScript(scriptPath);
    mainRenderer.run();
  })

  ipcMain.on('scriptSelect', (evt, arg) => {
    currentScript = arg;
    const scriptContent = ScriptsManager.loadScript(arg);
    win.webContents.send('editScript', scriptContent);
  });
