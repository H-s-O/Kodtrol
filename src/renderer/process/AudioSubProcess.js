import { spawn } from 'child_process';
import electron from 'electron';
import path from 'path';
import EventEmitter from 'events';

import { getConvertedAudiosDir } from '../lib/fileSystem';

export default class AudioSubProcess extends EventEmitter {
  childProcess = null;
  
  constructor() {
    super();
    
    const processPath = path.join(__dirname, './audio/kodtrol-audio.js');
    
    this.childProcess = spawn(electron, [
      '-r',
      'babel-register',
      processPath,
    ], {
      stdio: ['pipe', 'inherit', 'inherit'],
      env: {
        MANUSCRIPT_AUDIOS_DIR: getConvertedAudiosDir(),
      },
    });
  }
  
  send = (data) => {
    if (this.childProcess) {
      this.childProcess.stdin.write(JSON.stringify(data), 'utf8');
    }
  }
  
  destroy = () => {
    if (this.childProcess) {
      this.childProcess.kill();
    }
    this.childProcess = null;
  }
}