import path from 'path'
import { remote, ipcRenderer, /*contextBridge*/ } from 'electron';
import { readJson } from 'fs-extra';
import { extractAdditionalData } from './js/lib/helpers';

// @refactor
// for future electron versions, we should not be using the "remote" module

window.KODTROL_DEV = process.env['KODTROL_DEV'];
window.KODTROL_SCRIPTS_DIR = path.join(remote.app.getPath('userData'), 'scripts_compiled');
window.KODTROL_AUDIOS_DIR = path.join(remote.app.getPath('userData'), 'audios_converted');

ipcRenderer.once('port', (e) => window.electronMessagePort = e.ports[0])

const additionalData = extractAdditionalData()

// contextBridge.exposeInMainWorld('kodtrol', {
//   additionalData,
//   readProjectFile: async () => readJson(additionalData.projectFilePath),
// })

window.kodtrol = {
  additionalData,
  readProjectFile: async () => readJson(additionalData.projectFilePath),
}
