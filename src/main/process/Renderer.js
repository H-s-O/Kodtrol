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
        MANUSCRIPT_SCRIPTS_DIR: getCompiledScriptsDir(),
        MANUSCRIPT_AUDIOS_DIR: getConvertedAudiosDir(),
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
      if ('timelineInfo' in message) {
        this.emit(RendererEvent.TIMELINE_INFO_UPDATE, message.timelineInfo);
      }
      if ('boardInfo' in message) {
        this.emit(RendererEvent.BOARD_INFO_UPDATE, message.boardInfo);
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