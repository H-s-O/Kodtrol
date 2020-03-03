import { ipcMain } from 'electron';

export const ipcMainListen = (channel, callback) => {
  ipcMain.on(channel, callback);
};

export const ipcMainSend = (channel, ...data) => {
  ipcMain.send(channel, ...data);
};

export const ipcMainClear = () => {
  ipcMain.removeAllListeners();
};
