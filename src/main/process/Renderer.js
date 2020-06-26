import EventEmitter from 'events';
import { spawn } from 'child_process';
import path from 'path';
import electron from 'electron';

import { getCompiledScriptsDir, getConvertedAudiosDir } from '../lib/fileSystem';
import * as RendererEvent from '../events/RendererEvent';
import isDev from '../../common/js/lib/isDev';

export default class Renderer extends EventEmitter {
  _childProcess = null;

  constructor() {
    super();

    const processPath = path.join(__dirname, '../../renderer/kodtrol-renderer.js');
console.log(electron)
    this._childProcess = spawn(electron, [
      ...(isDev ? [
        '-r',
        '@babel/register',
      ] : []),
      processPath,
    ], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      env: {
        KODTROL_DEV: process.env['KODTROL_DEV'],
        KODTROL_SCRIPTS_DIR: getCompiledScriptsDir(),
        KODTROL_AUDIOS_DIR: getConvertedAudiosDir(),
      }
    });
    this._childProcess.on('message', this.onMessage);
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
    if (this._childProcess) {
      if (!this._childProcess.connected) {
        console.error('Renderer subprocess not connected!');
        return;
      }

      this._childProcess.send(data);
    }
  }

  destroy = () => {
    if (this._childProcess) {
      this._childProcess.kill();
    }
    this._childProcess = null;
  }
}
