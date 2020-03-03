import { ipcRenderer } from 'electron';

export const ipcRendererListen = (channel, callback) => {
  ipcRenderer.on(channel, callback);
}

export const ipcRendererSend = (channel, ...data) => {
  ipcRenderer.send(channel, ...data);
};
