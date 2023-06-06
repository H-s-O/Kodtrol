import { ipcMain } from 'electron';

export const ipcMainListen = (channel, callback) => {
  ipcMain.on(channel, callback);
};

export const ipcMainClear = () => {
  ipcMain.removeAllListeners();
};
