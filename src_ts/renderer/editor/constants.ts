import { ItemTriggerBehavior, ItemTriggerSource } from "../../common/constants";

export const enum KodtrolDialogType {
  ADD = 'add',
  DUPLICATE = 'duplicate',
  EDIT = 'edit',
  CONFIGURE = 'configure',
  //
  IMPORT_DEVICES = 1,
  IMPORT_SCRIPTS = 2,
  IMPORT_MEDIAS = 4,
  IMPORT_TIMELINES = 8,
  IMPORT_BOARDS = 16,
  IMPORT_ALL = 31,
};

export const enum KodtrolIconType {
  DEVICE = 'cube',
  SCRIPT = 'application',
  MEDIA = 'music',
  TIMELINE = 'film',
  BOARD = 'heat-grid',
  INPUT = 'log-in',
  OUTPUT = 'log-out',
  CURVE = 'flows',
  TRIGGER = 'symbol-diamond',
  LAYER = 'layer',
};

/**
 * Generated by running the following in a BrowserWindow:
 * ```
 * const { Howler } = require('howler');
 * // Note: we comment out video containers formats, which we don't support for now.
 * const supportedAudioFormats = [
 *   'mp3',
 *   // 'mpeg',
 *   'opus',
 *   'ogg',
 *   'oga',
 *   'wav',
 *   'aac',
 *   'caf',
 *   'm4a',
 *   'm4b',
 *   // 'mp4',
 *   'weba',
 *   // 'webm',
 *   'dolby',
 *   'flac'
 * ].filter((codec) => Howler.codecs(codec));
 * console.log(supportedAudioFormats);
 * ```
 * @TODO automate in an external script file?
 */
export const KODTROL_SUPPORTED_AUDIO_FORMATS = [
  'mp3', 'opus', 'ogg', 'oga', 'wav', 'aac', 'm4a', 'm4b', 'weba', 'flac'
] as const;

export const ITEM_LABELS = {
  [ItemTriggerBehavior.TRIGGER_ONCE]: 'Trigger once',
  [ItemTriggerBehavior.TRIGGER_MULTIPLE]: 'Trigger multiple',
  [ItemTriggerBehavior.TOGGLE]: 'Toggle',

  [ItemTriggerSource.MIDI_CC]: 'MIDI CC value 0/127',
  [ItemTriggerSource.MIDI_NOTE]: 'MIDI note on/off',
} as const;
