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

contextBridge.exposeInMainWorld('kodtrol_splash', {
  mainRequestQuit,
  mainRequestCreateProject,
  mainRequestLoadProject,
  ...additionalArgs,
});
