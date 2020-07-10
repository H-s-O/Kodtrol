import EventEmitter from 'events';
import { ipcMain } from 'electron';
import { createStore, applyMiddleware } from 'redux'
import { forwardToRenderer, replayActionMain } from 'electron-redux';
import { observer, observe } from 'redux-observers'

import * as StoreEvent from '../events/StoreEvent';
import reducers from '../../common/js/store/reducers/index';
import saveableContentCallback from './saveableContentCallback';

export default class Store extends EventEmitter {
  store = null;

  constructor(initialState = null) {
    super();

    this.store = createStore(
      reducers,
      initialState || {},
      applyMiddleware(
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
    const runDeviceObserver = observer(
      (state) => {
        return state.runDevice;
      },
      this.onRunDevice
    );
    const runScriptObserver = observer(
      (state) => {
        return state.runScript;
      },
      this.onRunScript
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
    const consoleObserver = observer(
      (state) => {
        return state.console;
      },
      this.onConsoleChange
    );

    observe(this.store, [
      outputsObserver,
      inputsObserver,
      devicesObserver,
      scriptsObserver,
      mediasObserver,
      timelinesObserver,
      boardsObserver,
      runDeviceObserver,
      runScriptObserver,
      runTimelineObserver,
      runBoardObserver,
      consoleObserver,
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

  onRunDevice = (dispatch, current, previous) => {
    this.emit(StoreEvent.RUN_DEVICE);
  }

  onRunScript = (dispatch, current, previous) => {
    this.emit(StoreEvent.RUN_SCRIPT);
  }

  onRunTimeline = (dispatch, current, previous) => {
    this.emit(StoreEvent.RUN_TIMELINE);
  }

  onRunBoard = (dispatch, current, previous) => {
    this.emit(StoreEvent.RUN_BOARD);
  }

  onConsoleChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.CONSOLE_CHANGED);
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
