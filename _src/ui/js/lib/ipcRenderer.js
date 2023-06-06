import { ipcRenderer } from 'electron';

export const ipcRendererListen = (channel, callback) => {
  ipcRenderer.on(channel, callback);
}

export const ipcRendererClear = (channel = undefined, callback = undefined) => {
  if (!channel && !callback) {
    ipcRenderer.removeAllListeners();
  }
  ipcRenderer.removeListener(channel, callback);
}

export const ipcRendererSend = (channel, ...data) => {
  ipcRenderer.send(channel, ...data);
};
