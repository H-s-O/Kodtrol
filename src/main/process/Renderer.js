import EventEmitter from 'events';
import { fork } from 'child_process';
import path from 'path';

import * as RendererEvent from '../events/RendererEvent';

export default class Renderer extends EventEmitter {
  childProcess = null;
  
  constructor() {
    super();

    const modulePath = path.join(__dirname, '../../renderer/process.js');

    this.childProcess = fork(modulePath, {
      execArgv: [
        '-r',
        'babel-register',
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