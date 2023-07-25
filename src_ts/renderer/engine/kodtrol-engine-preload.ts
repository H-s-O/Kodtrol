import {
  contextBridge, ipcRenderer,
} from 'electron/renderer';
import events from 'events'
import objectHash from 'object-hash'
import lodash from 'lodash'
import uniqid from 'uniqid'
import os from 'os'
import path from 'path'
import dmx from 'dmx'
import laserDacCore from '@laser-dac/core'
import laserDacDraw from '@laser-dac/draw'
import laserDacLaserdock from '@laser-dac/laserdock'
import laserDacEtherDream from '@laser-dac/ether-dream'
import howler from 'howler'
import midi from '@julusian/midi'
import jzz from 'jzz'
import osc from 'osc'

import { extractAdditionalData } from '../common/lib/helpers';

const additionalArgs = extractAdditionalData<{
  HERSHEY_FONTS_DIR: string
}>();

const expose = {
  ...additionalArgs,
} as const;

contextBridge.exposeInMainWorld('kodtrol_engine', expose);

const exported = {
  events,
  'object-hash': objectHash,
  lodash,
  uniqid,
  os,
  path,
  dmx,
  '@laser-dac/core': laserDacCore,
  '@laser-dac/draw': laserDacDraw,
  '@laser-dac/laserdock': laserDacLaserdock,
  '@laser-dac/ether-dream': laserDacEtherDream,
  howler,
  '@julusian/midi': midi,
  jzz,
  osc,
}
const r = (name: string) => {
  console.log('require()', name)
  if (!(name in exported)) {
    throw new Error('Tried to require unexported module "' + name + '"')
  }
  return exported[name]
}
const m = {
  require: r
}

contextBridge.exposeInMainWorld('module', m);

//-------------------------------------------------------------------

const windowLoaded = new Promise((resolve) => {
  window.onload = resolve;
});

ipcRenderer.on('port', async (event) => {
  await windowLoaded;
  window.postMessage('port', '*', event.ports);
});

//-------------------------------------------------------------------

declare global {
  interface Window {
    readonly module: typeof m
    readonly kodtrol_engine: typeof expose
    kodtrol_editorPort?: MessagePort
  }
}
