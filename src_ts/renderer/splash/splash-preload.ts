import { contextBridge, ipcRenderer } from 'electron/renderer';

import {
  IPC_MAIN_CHANNEL_CREATE_PROJECT,
  IPC_MAIN_CHANNEL_LOAD_PROJECT,
  IPC_MAIN_CHANNEL_QUIT,
} from '../../common/constants';
import { extractAdditionalData } from '../lib/helpers';

const additionalArgs = extractAdditionalData();

const mainRequestQuit = () => {
  ipcRenderer.invoke(IPC_MAIN_CHANNEL_QUIT);
};

const mainRequestCreateProject = () => {
  ipcRenderer.invoke(IPC_MAIN_CHANNEL_CREATE_PROJECT);
};

const mainRequestLoadProject = () => {
  ipcRenderer.invoke(IPC_MAIN_CHANNEL_LOAD_PROJECT);
};

const expose = {
  mainRequestQuit,
  mainRequestCreateProject,
  mainRequestLoadProject,
  ...additionalArgs,
};

contextBridge.exposeInMainWorld('kodtrol_splash', expose);

declare global {
  interface Window {
    kodtrol_splash: typeof expose
  }
}