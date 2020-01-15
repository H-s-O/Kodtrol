import EventEmitter from 'events';
import { ipcMain } from 'electron';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import { observer, observe } from 'redux-observers'

import * as StoreEvent from '../events/StoreEvent';
import * as appReducers from '../../common/js/store/reducers/index';
import rootReducer from '../../common/js/store/reducers/root';
import resetRunningItems from '../../common/js/store/middlewares/resetRunningItems';
import resetCurrentItems from '../../common/js/store/middlewares/resetCurrentItems';
import resetTimelineInfoUser from '../../common/js/store/middlewares/resetTimelineInfoUser';
import resetTimelineInfo from '../../common/js/store/middlewares/resetTimelineInfo';
import resetBoardInfoUser from '../../common/js/store/middlewares/resetBoardInfoUser';
import resetBoardInfo from '../../common/js/store/middlewares/resetBoardInfo';
import saveableContentCallback from '../../common/js/store/middlewares/saveableContentCallback';

export default class Store extends EventEmitter {
  store = null;

  constructor(initialState = null) {
    super();

    this.store = createStore(
      rootReducer,
      initialState || {},
      applyMiddleware(
        resetCurrentItems(),
        resetRunningItems(),
        resetTimelineInfo(),
        resetTimelineInfoUser(),
        resetBoardInfo(),
        resetBoardInfoUser(),
        saveableContentCallback(this.onSaveableContent),
        forwardToRenderer, // IMPORTANT! This goes last
      ),
    );

    const outputsObserver = observer(
      (state) => {
        return state.outputs;
      },
      this.onOutputsChange
    );
    const inputsObserver = observer(
      (state) => {
        return state.inputs;
      },
      this.onInputsChange
    );
    const devicesObserver = observer(
      (state) => {
        return state.devices;
      },
      this.onDevicesChange
    );
    const scriptsObserver = observer(
      (state) => {
        return state.scripts;
      },
      this.onScriptsChange
    );
    const mediasObserver = observer(
      (state) => {
        return state.medias;
      },
      this.onMediasChange
    );
    const timelinesObserver = observer(
      (state) => {
        return state.timelines;
      },
      this.onTimelinesChange
    );
    const boardsObserver = observer(
      (state) => {
        return state.boards;
      },
      this.onBoardsChange
    );
    const previewScriptObserver = observer(
      (state) => {
        return state.previewScript;
      },
      this.onPreviewScript
    );
    const runTimelineObserver = observer(
      (state) => {
        return state.runTimeline;
      },
      this.onRunTimeline,
    );
    const runBoardObserver = observer(
      (state) => {
        return state.runBoard;
      },
      this.onRunBoard,
    );
    const timelineInfoUserObserver = observer(
      (state) => {
        return state.timelineInfoUser;
      },
      this.onTimelineInfoUserChange
    );
    const boardInfoUserObserver = observer(
      (state) => {
        return state.boardInfoUser;
      },
      this.onBoardInfoUserChange
    );

    observe(this.store, [
      outputsObserver,
      inputsObserver,
      devicesObserver,
      scriptsObserver,
      mediasObserver,
      timelinesObserver,
      boardsObserver,
      previewScriptObserver,
      runTimelineObserver,
      runBoardObserver,
      timelineInfoUserObserver,
      boardInfoUserObserver,
    ]);
    replayActionMain(this.store);
  }

  get state() {
    if (this.store) {
      return this.store.getState();
    }

    return null;
  }

  onSaveableContent = (action) => {
    this.emit(StoreEvent.CONTENT_SAVED);
  }

  onOutputsChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.OUTPUTS_CHANGED);
  }

  onInputsChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.INPUTS_CHANGED);
  }

  onDevicesChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.DEVICES_CHANGED);
  }

  onScriptsChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.SCRIPTS_CHANGED);
  }

  onMediasChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.MEDIAS_CHANGED);
  }

  onTimelinesChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.TIMELINES_CHANGED);
  }

  onBoardsChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.BOARDS_CHANGED);
  }

  onPreviewScript = (dispatch, current, previous) => {
    this.emit(StoreEvent.PREVIEW_SCRIPT);
  }

  onRunTimeline = (dispatch, current, previous) => {
    this.emit(StoreEvent.RUN_TIMELINE);
  }

  onRunBoard = (dispatch, current, previous) => {
    this.emit(StoreEvent.RUN_BOARD);
  }

  onTimelineInfoUserChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.TIMELINE_INFO_USER_CHANGED);
  }

  onBoardInfoUserChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.BOARD_INFO_USER_CHANGED);
  }

  dispatch = (action) => {
    if (this.store) {
      this.store.dispatch(action);
    }
  }

  destroy = () => {
    this.store = null;

    // electron-redux does not offer destructors, so we must manually remove
    // the listeners it added to ipcMain, otherwise we get duplicate actions
    // @TODO open an issue on Github ?
    ipcMain.removeAllListeners('redux-action');
  }
}
