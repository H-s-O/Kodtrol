import { AnyAction, combineReducers } from 'redux';

import fileVersion from './fileVersion';
import devices from './devices';
import editTimelines from './editTimelines';
import editScripts from './editScripts';
import editBoards from './editBoards';
import scripts from './scripts';
import medias from './medias';
import timelines from './timelines';
import runDevice from './runDevice';
import runScript from './runScript';
import runTimeline from './runTimeline';
import runBoard from './runBoard';
import boards from './boards';
import outputs from './outputs';
import inputs from './inputs';
import ioStatus from './ioStatus';
import ioAvailable from './ioAvailable';
import dialogs from './dialogs';
import lastEditor from './lastEditor';
import console from './console';
import saveEditedItems from './top/saveEditedItems';
import setActiveEditor from './top/setActiveEditor';
import trackLastEditor from './top/trackLastEditor';
import { KodtrolState } from '../../../../common/types';

const standardReducers = combineReducers<KodtrolState>({
  fileVersion,
  outputs,
  inputs,
  ioStatus,
  ioAvailable,
  devices,
  runDevice,
  scripts,
  editScripts,
  runScript,
  timelines,
  editTimelines,
  runTimeline,
  boards,
  editBoards,
  runBoard,
  medias,
  dialogs,
  lastEditor,
  console,
});

export default (previousState: KodtrolState, action: AnyAction): KodtrolState => {
  let newState: KodtrolState;
  newState = standardReducers(previousState, action);
  newState = saveEditedItems(newState, action);
  newState = setActiveEditor(newState, action);
  newState = trackLastEditor(newState, action);
  return newState;
};
