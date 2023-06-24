import { KodtrolDialogType } from '../renderer/editor/constants';
import { IO, IOStatus, IOType } from './constants';

// export type FileVersionState = `${number}.${number}.${number}`; // pedantic mode
export type FileVersionState = string;

export type DeviceId = string;
export type DeviceTag = string;
export type Device = {
  id: DeviceId
  name: string
  type: IOType
  tags: DeviceTag[]
  output: OutputId | null
};
export type DevicesState = Device[];

export type ScriptId = string;
export type Script = {
  id: ScriptId
  name: string
  content: string
  tempo: number | null
  devices: {
    device?: DeviceId
  }[]
  devicesGroups: []
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
  name: string
  file: string
  duration?: number
};
export type MediasState = Media[];

export type LayerId = string
export type Layer = {
  id: LayerId
  order: number
};
export type LayersState = Layer[];

export type TimelineId = string;
export type Timeline = {
  id: TimelineId
  name: string
  duration: number
  zoom: number
  zoomVert: number
  items: []
  layers: LayersState
  tempo: number | null
  recording: boolean
  recordedTriggers: []
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
  name: string
  zoom: number
  zoomVert: number
  items: []
  layers: LayersState
  tempo: number | null
};
export type BoardsState = Board[];

export type EditBoard = Board & {
  changed: boolean
  active: boolean
};
export type EditBoardsState = EditBoard[];

export type ConsoleState = boolean;

export type ImportDialogValue = {
  devices: DevicesState | null
  scripts: ScriptsState | null
  medias: MediasState | null
  timelines: TimelinesState | null
  boards: BoardsState | null
};

export type DialogsState = {
  deviceDialogOpened: boolean
  deviceDialogMode: KodtrolDialogType | null
  deviceDialogValue: Device | null
  //
  scriptDialogOpened: boolean
  scriptDialogMode: KodtrolDialogType | null
  scriptDialogValue: Script | null
  //
  mediaDialogOpened: boolean
  mediaDialogMode: KodtrolDialogType | null
  mediaDialogValue: Media | null
  //
  timelineDialogOpened: boolean
  timelineDialogMode: KodtrolDialogType | null
  timelineDialogValue: Timeline | null
  //
  boardDialogOpened: boolean
  boardDialogMode: KodtrolDialogType | null
  boardDialogValue: Board | null
  //
  configDialogOpened: boolean
  configDialogMode: KodtrolDialogType | null
  configDialogValue: object | null
  //
  importDialogOpened: boolean
  importDialogMode: KodtrolDialogType | null
  importDialogValue: ImportDialogValue | null
};

export type InputId = string;
export type Input = {
  id: InputId
  name: string
  type: IOType
};
export type InputsState = Input[];

export type OutputId = string;
export type Output = {
  id: OutputId
  name: string
  type: IOType
};
export type OutputsState = Output[];

export type IOAvailable = {
  id: InputId | OutputId
  mode: IO
};
export type IOAvailableState = IOAvailable[];

export type IOStatusState = {
  [key: InputId | OutputId]: IOStatus
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

//-----------------------------------------------------------------------------------------------

export type ItemNamesObject<K extends string = string> = {
  [k in K]: string;
};

export type FolderId = string;
export type Folder = {
  id: FolderId
  name: string
};
