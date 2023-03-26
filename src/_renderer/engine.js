import { ipcRenderer } from 'electron';

import Renderer from '../renderer/Renderer';

let renderer;

ipcRenderer.once('port', (e) => renderer = new Renderer(e.ports[0]))
