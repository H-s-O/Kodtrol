import EventEmitter from 'events';
import { fork } from 'child_process';
import path from 'path';

import { getCompiledScriptsDir, getConvertedAudiosDir } from '../lib/fileSystem';
import * as RendererEvent from '../events/RendererEvent';
import isDev from '../../common/js/lib/isDev';

export default class Renderer extends EventEmitter {
  childProcess = null;

  constructor() {
    super();

    const processPath = path.join(__dirname, '../../renderer/kodtrol-renderer.js');

    this.childProcess = fork(processPath, {
      env: {
        KODTROL_DEV: process.env['KODTROL_DEV'],
        KODTROL_SCRIPTS_DIR: getCompiledScriptsDir(),
        KODTROL_AUDIOS_DIR: getConvertedAudiosDir(),
      },
      ...(isDev ? {
        execArgv: [
          '-r',
          '@babel/register',
        ],
      } : {}),
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
        if ('scriptError' in message) {
          this.emit(RendererEvent.SCRIPT_ERROR, message.scriptError);
        }
        if ('scriptLog' in message) {
          this.emit(RendererEvent.SCRIPT_LOG, message.scriptLog);
        }
      }
    }
  }

  send = (data) => {
    if (this.childProcess) {
      if (!this.childProcess.connected) {
        console.error('Renderer subprocess not connected!');
        return;
      }

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
