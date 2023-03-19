import path from 'path'
import { remote } from 'electron';

// @refactor
// for future electron versions, we should not be using the "remote" module

window.KODTROL_DEV = process.env['KODTROL_DEV'];
window.KODTROL_SCRIPTS_DIR = path.join(remote.app.getPath('userData'), 'scripts_compiled');
window.KODTROL_AUDIOS_DIR = path.join(remote.app.getPath('userData'), 'audios_converted');
