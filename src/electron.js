import { app, BrowserWindow, ipcMain } from 'electron';
import { get, set, uniq } from 'lodash';
import path from 'path';
import url from 'url';
import DMX from 'dmx';

import { readAppConfig, writeAppConfig, createProject } from './main/lib/fileSystem';
import { createProjectDialog } from './main/lib/dialogs';
import ScriptsManager from './main/ScriptsManager';
import DevicesManager from './main/DevicesManager';
import TimelinesManager from './main/TimelinesManager';
import MainRenderer from './main/MainRenderer';
import TimelineRenderer from './main/render/TimelineRenderer';
import TimelineRendererEvent from './main/events/TimelineRendererEvent';

const main = async () => {
  let dmx = new DMX();
      // dmx.addUniverse('main', 'null', '/dev/tty.usbserial-EN086444');
      dmx.addUniverse('main', 'enttec-usb-dmx-pro', '/dev/tty.usbserial-EN086444');

  ScriptsManager.init();
  DevicesManager.init();
  TimelinesManager.init();

  let currentScript = null;
  let currentTimeline = null;
  let currentRenderer = null;
  let mainRenderer = null;

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  let currentProjectFilePath;

  function createWindow () {
    console.log(__dirname);
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../dev/extensions/fmkadmapgofadopljbjfkapdkoienihi/3.2.1_0'));

    // Create the browser window.
    win = new BrowserWindow({width: 1600, height: 900})
    // and load the index.html of the app.
    // win.loadURL(url.format({
    //   pathname: path.join(__dirname, '../dist/ui/index.html'),
    //   protocol: 'file:',
    //   slashes: true
    // }))
    win.loadURL('http://localhost:8080/');
    const contents = win.webContents;
    contents.on('did-finish-load', () => {
      const scripts = ScriptsManager.listScripts().map(({id, name}) => ({
        id,
        name,
        current: id === currentScript,
      }));
      // console.log(scripts);
      contents.send('updateScripts', scripts);

      const devices = DevicesManager.listDevices().map(({id, name}) => ({
        id,
        name,
      }));
      // console.log(devices);
      contents.send('updateDevices', devices);

      const timelines = TimelinesManager.listTimelines().map(({id, name}) => ({
        id,
        name,
        current: id === currentTimeline,
      }));
      // console.log(timelines);
      contents.send('updateTimelines', timelines);
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
  app.on('ready', () => {
    const appConfig = readAppConfig();
    const configCurrentProject = get(appConfig, 'currentProjectFilePath');
    if (!configCurrentProject) {
      const requestedProjectPath = createProjectDialog();
      currentProjectFilePath = createProject(requestedProjectPath);
      set(appConfig, 'currentProjectFilePath', currentProjectFilePath);
      writeAppConfig(appConfig);
    } else {
      currentProjectFilePath = configCurrentProject;
    }

    ScriptsManager.projectFilePath = currentProjectFilePath;
    DevicesManager.projectFilePath = currentProjectFilePath;
    TimelinesManager.projectFilePath = currentProjectFilePath;

    createWindow();
  })

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    if (currentRenderer) {
      currentRenderer.removeAllListeners();
      currentRenderer.destroy();
    }
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
    const { id, content } = arg;
    const scriptData = ScriptsManager.saveScript(id, content);
    if (currentRenderer) {
      currentRenderer.removeAllListeners();
      currentRenderer.destroy();
      currentRenderer = null;
    }
    if (!mainRenderer) {
      mainRenderer = new MainRenderer(dmx);
    }
    mainRenderer.reloadScript(scriptData, DevicesManager.devices);
    mainRenderer.run();
  })

  ipcMain.on('scriptSelect', (evt, arg) => {
    currentScript = arg;
    const scripts = ScriptsManager.listScripts().map(({id, name}) => ({
      id,
      name,
      current: id === currentScript,
    }));
    win.webContents.send('updateScripts', scripts);
    const scriptContent = ScriptsManager.loadScript(arg);
    win.webContents.send('editScript', {
      id: arg,
      content: scriptContent,
    });
  });

  ipcMain.on('scriptCreate', (evt, arg) => {
    currentScript = ScriptsManager.createScript(arg);
    const scripts = ScriptsManager.listScripts().map(({id, name}) => ({
      id,
      name,
      current: id === currentScript,
    }));
    win.webContents.send('updateScripts', scripts);
    const scriptContent = ScriptsManager.loadScript(currentScript);
    win.webContents.send('editScript', {
      id: currentScript,
      content: scriptContent,
    });
  });

  ipcMain.on('deviceCreate', (evt, arg) => {
    DevicesManager.createDevice(arg);
    const devices = DevicesManager.listDevices().map(({id, name}) => ({
      id,
      name,
    }));
    win.webContents.send('updateDevices', devices);
  });

  ipcMain.on('timelineSelect', (evt, arg) => {
    currentTimeline = arg;
    const timelines = TimelinesManager.listTimelines().map(({id, name}) => ({
      id,
      name,
      current: id === currentTimeline,
    }));
    win.webContents.send('updateTimelines', timelines);
    const timelineContent = TimelinesManager.loadTimeline(arg);
    win.webContents.send('editTimeline', timelineContent);
    // win.webContents.send('editTimeline', {
    //   id: arg,
    //   content: timelineContent,
    // });

    if (mainRenderer) {
      mainRenderer.destroy();
      mainRenderer = null;
    }

    if (currentRenderer) {
      currentRenderer.removeAllListeners();
      currentRenderer.destroy();
      currentRenderer = null;
    }
    currentRenderer = new TimelineRenderer(timelineContent, { main: dmx });
    const timelineScripts = currentRenderer.scriptIds;
    const timelineScriptsClasses = timelineScripts.reduce((obj, scriptId) => ({
      ...obj,
      [scriptId]: {
        scriptClass: ScriptsManager.loadCompiledScript(scriptId),
        scriptData: ScriptsManager.loadScriptData(scriptId),
      },
    }), {});
    currentRenderer.updateScripts(timelineScriptsClasses);
    currentRenderer.updateDevices(DevicesManager.devices);
    currentRenderer.init();
    currentRenderer.on(TimelineRendererEvent.UPDATE_POSITION, (position) => {
      win.webContents.send('updateTimelineInfo', {
        position,
      });
    });
    currentRenderer.start();
  });

  ipcMain.on('timelineCreate', (evt, arg) => {
    currentTimeline = TimelinesManager.createTimeline(arg);
    const timelines = TimelinesManager.listTimelines().map(({id, name}) => ({
      id,
      name,
      current: id === currentTimeline,
    }));
    win.webContents.send('updateTimelines', timelines);
    const timelineContent = TimelinesManager.loadTimeline(currentTimeline);
    win.webContents.send('editTimeline', timelineContent);
  });

  ipcMain.on('saveTimeline', (evt, arg) => {
    const { id, content } = arg;
    const timelineData = TimelinesManager.saveTimeline(id, content);
    win.webContents.send('editTimeline', timelineData);
  })

  ipcMain.on('timelineStatus', (evt, arg) => {
    if (currentRenderer) {
      const position = get(arg, 'position', null);
      if (position != null) {
        currentRenderer.setPosition(position);
      }
    }
  })
};

main();
