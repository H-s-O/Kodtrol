import { combineReducers } from 'redux';

import fileVersion from './fileVersion';
import devices from './devices';
import devicesFolders from './devicesFolders';
import editTimelines from './editTimelines';
import editScripts from './editScripts';
import editBoards from './editBoards';
import scripts from './scripts';
import scriptsFolders from './scriptsFolders';
import medias from './medias';
import timelineInfo from './timelineInfo';
import timelineInfoUser from './timelineInfoUser';
import boardInfo from './boardInfo';
import boardInfoUser from './boardInfoUser';
import timelines from './timelines';
import modals from './modals';
import runScript from './runScript';
import runTimeline from './runTimeline';
import runBoard from './runBoard';
import boards from './boards';
import outputs from './outputs';
import inputs from './inputs';
import ioStatus from './ioStatus';
import dialogs from './dialogs';
import saveEditedScript from './saveEditedScript';

const standardReducers = combineReducers({
  fileVersion,
  outputs,
  inputs,
  ioStatus,
  devices,
  devicesFolders,
  scripts,
  scriptsFolders,
  editScripts,
  runScript,
  timelines,
  editTimelines,
  runTimeline,
  timelineInfo,
  timelineInfoUser,
  boards,
  editBoards,
  runBoard,
  boardInfo,
  boardInfoUser,
  medias,
  modals,
  dialogs,
});

export default (previousState, action) => {
  let newState;
  newState = standardReducers(previousState, action);
  newState = saveEditedScript(newState, action);
  return newState;
};
