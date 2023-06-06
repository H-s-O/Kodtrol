export const IO_DISCONNECTED = 0;
export const IO_CONNECTED = 1;
export const IO_ACTIVITY = 2;

export const IO_INPUT = 'input';
export const IO_OUTPUT = 'output';

export const IO_MIDI = 'midi';
export const IO_OSC = 'osc';
export const IO_DMX = 'dmx';
export const IO_ARTNET = 'artnet';
export const IO_SERIAL = 'serial';
export const IO_ILDA = 'ilda';
export const IO_AUDIO = 'audio';

export const IO_LABELS = {
  [IO_DISCONNECTED]: 'Disconnected',
  [IO_CONNECTED]: 'Connected',
  [IO_ACTIVITY]: 'Activity',

  [IO_INPUT]: 'Input',
  [IO_OUTPUT]: 'Output',

  [IO_MIDI]: 'MIDI',
  [IO_OSC]: 'OSC',
  [IO_DMX]: 'DMX',
  [IO_ARTNET]: 'Art-Net',
  [IO_SERIAL]: 'Serial',
  [IO_ILDA]: 'ILDA',
  [IO_AUDIO]: 'Audio',
};
