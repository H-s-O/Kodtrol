import {
  contextBridge, ipcRenderer,
} from 'electron/renderer';

import { extractAdditionalData } from '../common/lib/helpers';

const additionalArgs = extractAdditionalData();

const expose = {
  ...additionalArgs,
} as const;

contextBridge.exposeInMainWorld('kodtrol_editor', expose);

const m = {
  require, // let Parcel bundles use native require()
}

contextBridge.exposeInMainWorld('module', m);

//-------------------------------------------------------------------

const windowLoaded = new Promise((resolve) => {
  window.onload = resolve;
});

ipcRenderer.on('port', async (event) => {
  await windowLoaded;
  window.postMessage('port', '*', event.ports);
});

//-------------------------------------------------------------------

declare global {
  interface Window {
    readonly module: typeof m
    readonly kodtrol_engine: typeof expose
    kodtrol_editorPort?: MessagePort
  }
}
