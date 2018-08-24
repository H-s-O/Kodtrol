import EventEmitter from 'events';
import { fork } from 'child_process';
import path from 'path';

import * as RendererEvent from '../events/RendererEvent';

export default class Renderer extends EventEmitter {
  childProcess = null;
  
  constructor() {
    super();

    const modulePath = path.join(__dirname, '../../renderer/index.js');
    const babelRegister = path.join(__dirname, '../../..');

    // wtf: modulePath is completely ignored
    this.childProcess = fork(modulePath, {
      env: {
        MANUSCRIT_RENDERER: 1,
      },
      execArgv: [
        '-r',
        'babel-register',
        babelRegister,
      ],
    });
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