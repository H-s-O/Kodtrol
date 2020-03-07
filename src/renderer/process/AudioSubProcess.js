import { spawn } from 'child_process';
import electron from 'electron';
import { join } from 'path';
import EventEmitter from 'events';

import { getConvertedAudiosDir } from '../lib/fileSystem';

export default class AudioSubProcess extends EventEmitter {
  _childProcess = null;

  constructor() {
    super();

    const processPath = join(__dirname, './audio/kodtrol-audio.js');

    this._childProcess = spawn(electron, [
      '-r',
      '@babel/register',
      processPath,
    ], {
      stdio: ['pipe', 'inherit', 'inherit'],
      env: {
        KODTROL_AUDIOS_DIR: getConvertedAudiosDir(),
      },
    });
  }

  send = (data) => {
    if (this._childProcess) {
      this._childProcess.stdin.write(JSON.stringify(data), 'utf8');
    }
  }

  destroy = () => {
    if (this._childProcess) {
      this._childProcess.kill();
    }
    this._childProcess = null;
  }
}
