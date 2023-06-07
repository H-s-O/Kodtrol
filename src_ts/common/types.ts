import { IOStatus } from './constants';

// export type FileVersionState = `${number}.${number}.${number}`; // pedantic mode
export type FileVersionState = string;

export type DeviceId = string;
export type Device = {
  id: DeviceId
};
export type DevicesState = Device[];

export type ScriptId = string;
export type Script = {
  id: ScriptId
  content: string
};
export type ScriptsState = Script[];

export type EditScript = Script & {
  changed: boolean
  active: boolean
};
export type EditScriptsState = EditScript[];

export type MediaId = string;
export type Media = {
  id: MediaId
};
export type MediasState = Media[];

export type TimelineId = string;
export type Timeline = {
  id: TimelineId
};
export type TimelinesState = Timeline[];

export type EditTimeline = Timeline & {
  changed: boolean
  active: boolean
};
export type EditTimelinesState = EditTimeline[];

export type BoardId = string;
export type Board = {
  id: BoardId
};
export type BoardsState = Board[];

export type EditBoard = Board & {
  changed: boolean
  active: boolean
};
export type EditBoardsState = EditBoard[];

export type ConsoleState = boolean;

export type DialogsState = {
  deviceDialogOpened: boolean
  deviceDialogMode: string | null
  deviceDialogValue: object | null
  //
  scriptDialogOpened: boolean
  scriptDialogMode: string | null
  scriptDialogValue: object | null
  //
  mediaDialogOpened: boolean
  mediaDialogMode: string | null
  mediaDialogValue: object | null
  //
  timelineDialogOpened: boolean
  timelineDialogMode: string | null
  timelineDialogValue: object | null
  //
  boardDialogOpened: boolean
  boardDialogMode: string | null
  boardDialogValue: object | null
  //
  configDialogOpened: boolean
  configDialogMode: string | null
  configDialogValue: object | null
  //
  importDialogOpened: boolean
  importDialogMode: string | null
  importDialogValue: object | null
};

export type InputId = string;
export type Input = {
  id: InputId
};
export type InputsState = Input[];

export type OutputId = string;
export type Output = {
  id: OutputId
};
export type OutputsState = Output[];

export type IOAvailableState = object[];

export type IOStatusState = {
  [key: string]: IOStatus
};

export type LastEditorState =
  { type: 'script', id: ScriptId }
  | { type: 'timeline', id: TimelineId }
  | { type: 'board', id: BoardId }
  | null;

export type RunBoardState = BoardId | null;

export type RunDeviceState = DeviceId | null;

export type RunScriptState = ScriptId | null;

export type RunTimelineState = TimelineId | null;

export type KodtrolState = {
  fileVersion: FileVersionState
  outputs: OutputsState
  inputs: InputsState
  ioStatus: IOStatusState
  ioAvailable: IOAvailableState
  devices: DevicesState
  runDevice: RunDeviceState
  scripts: ScriptsState
  editScripts: EditScriptsState
  runScript: RunScriptState
  timelines: TimelinesState
  editTimelines: EditTimelinesState
  runTimeline: RunTimelineState
  boards: BoardsState
  editBoards: EditBoardsState
  runBoard: RunBoardState
  medias: MediasState
  dialogs: DialogsState
  lastEditor: LastEditorState
  console: ConsoleState
};

//-----------------------------------------------------------------------------------------------

export type WindowAdditionalArgs = {
  APP_VERSION: string
  IS_DEV: boolean
  IS_MAC: boolean
  IS_WINDOWS: boolean
  IS_LINUX: boolean
};
