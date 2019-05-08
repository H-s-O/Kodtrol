import EventEmitter from 'events';
import { fork } from 'child_process';
import path from 'path';

import { getCompiledScriptsDir, getConvertedAudiosDir } from '../lib/fileSystem';
import * as RendererEvent from '../events/RendererEvent';

export default class Renderer extends EventEmitter {
  childProcess = null;
  
  constructor() {
    super();

    const processPath = path.join(__dirname, '../../renderer/kodtrol-renderer.js');

    this.childProcess = fork(processPath, {
      env: {
        KODTROL_SCRIPTS_DIR: getCompiledScriptsDir(),
        KODTROL_AUDIOS_DIR: getConvertedAudiosDir(),
      },
      execArgv: [
        '-r',
        'babel-register',
      ],
    });
    this.childProcess.on('message', this.onMessage);
  }
  
  onMessage = (message) => {
    if (message) {
      if (message === 'ready') {
        this.emit(RendererEvent.READY);
      } else {
        if ('timelineInfo' in message) {
          this.emit(RendererEvent.TIMELINE_INFO_UPDATE, message.timelineInfo);
        }
        if ('boardInfo' in message) {
          this.emit(RendererEvent.BOARD_INFO_UPDATE, message.boardInfo);
        }
        if ('ioStatus' in message) {
          this.emit(RendererEvent.IO_STATUS_UPDATE, message.ioStatus);
        }
      }
    }
  }
  
  send = (data) => {
    if (this.childProcess) {
      this.childProcess.send(data);
    }
  }
  
  destroy = () => {
    if (this.childProcess) {
      this.childProcess.kill();
    }
    this.childProcess = null;
  }
}