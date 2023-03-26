import path from 'path'
import { remote, ipcRenderer, /*contextBridge*/ } from 'electron';
import { readJson } from 'fs-extra';
import { extractAdditionalData } from './js/lib/helpers';

// @refactor
// for future electron versions, we should not be using the "remote" module

window.KODTROL_DEV = process.env['KODTROL_DEV'];
window.KODTROL_SCRIPTS_DIR = path.join(remote.app.getPath('userData'), 'scripts_compiled');
window.KODTROL_AUDIOS_DIR = path.join(remote.app.getPath('userData'), 'audios_converted');

const additionalData = extractAdditionalData()

// contextBridge.exposeInMainWorld('kodtrol', {
//   additionalData,
//   readProjectFile: async () => readJson(additionalData.projectFilePath),
// })

window.kodtrol = {
  ready: () => new Promise((resolve, reject) => {
    const int = setInterval(() => {
      if (window.kodtrol.messagePort) {
        clearInterval(int);
        resolve();
      }
    }, 100);
  }),
  additionalData,
  readProjectFile: async () => readJson(additionalData.projectFilePath),
  messagePort: null,
}

ipcRenderer.once('port', (e) => {
  window.kodtrol.messagePort = e.ports[0];
});
