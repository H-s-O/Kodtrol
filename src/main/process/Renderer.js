import EventEmitter from 'events';
import { fork } from 'child_process';
import path from 'path';

import * as RendererEvent from '../events/RendererEvent';

export default class Renderer extends EventEmitter {
  childProcess = null;
  
  constructor() {
    super();

    const execPath = `${process.execPath} -r babel-register ${path.join(__dirname, '/../../')}`; // temp for dev
    this.childProcess = fork(path.join(__dirname, '../../renderer/renderer'));
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