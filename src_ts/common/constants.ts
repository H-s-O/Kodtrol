export const APP_NAME = 'Kodtrol';

export const PROJECT_FILE_EXTENSION = 'kodtrol';

export const IPC_MAIN_CHANNEL_QUIT = 'kodtrol-ipc-main-channel-quit';
export const IPC_MAIN_CHANNEL_CREATE_PROJECT = 'kodtrol-ipc-main-channel-create-project';
export const IPC_MAIN_CHANNEL_LOAD_PROJECT = 'kodtrol-ipc-main-channel-load-project';

export const SCRIPT_TEMPLATE =
  `// function start(devices) {
// }

// function leadInFrame(devices, { /* block info */ }, { /* triggers */ }, { /* curves */ }) {
// }

// function frame(devices, { /* block info */ }, { /* triggers */ }, { /* curves */ }) {
// }

// function leadOutFrame(devices, { /* block info */ }, { /* triggers */ }, { /* curves */ }) {
// }

// function beat(devices, { localBeat, globalBeat }) {
// }

// function input(devices, inputType, inputData) {
// }`;


export const enum IOStatus {
  DISCONNECTED = 0,
  CONNECTED = 1,
  ACTIVITY = 2,
};

export const enum IOType {
  MIDI = 'midi',
  OSC = 'osc',
  DMX = 'dmx',
  ARTNET = 'artnet',
  SERIAL = 'serial',
  ILDA = 'ilda',
  AUDIO = 'audio',
};
