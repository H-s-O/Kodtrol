import EventEmitter from 'events';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import { observer, observe } from 'redux-observers'

import * as StoreEvent from '../events/StoreEvent';
import * as appReducers from '../../common/js/store/reducers/index';
import resetRunningItems from '../../common/js/store/middlewares/resetRunningItems';
import resetCurrentItems from '../../common/js/store/middlewares/resetCurrentItems';
import resetTimelineInfoUser from '../../common/js/store/middlewares/resetTimelineInfoUser';
import resetTimelineInfo from '../../common/js/store/middlewares/resetTimelineInfo';
import saveableContentCallback from '../../common/js/store/middlewares/saveableContentCallback';

export default class Store extends EventEmitter {
  store = null;
  
  constructor(initialState = null) {
    super();
    
    this.store = createStore(
      combineReducers(appReducers),
      initialState || {},
      applyMiddleware(
        resetCurrentItems(),
        resetRunningItems(),
        resetTimelineInfo(),
        resetTimelineInfoUser(),
        saveableContentCallback(this.onSaveableContent),
        forwardToRenderer, // IMPORTANT! This goes last
      ),
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
    const timelinesObserver = observer(
      (state) => {
        return state.timelines;
      },
      this.onTimelinesChange
    );
    const previewScriptObserver = observer(
      (state) => {
        const { previewScript, scripts } = state;
        return {
          previewScript,
          scripts,
        };
      },
      this.onPreviewScript
    );
    const runTimelineObserver = observer(
      (state) => {
        const { runTimeline, timelines } = state;
        return {
          runTimeline,
          timelines,
        };
      },
      this.onRunTimeline,
    );
    const runBoardObserver = observer(
      (state) => {
        const { runBoard, boards } = state;
        return {
          runBoard,
          boards,
        };
      },
      this.onRunBoard,
    );
    const timelineInfoUserObserver = observer(
      (state) => {
        return state.timelineInfoUser;
      },
      this.onTimelineInfoUserChange
    );
    
    observe(this.store, [
      devicesObserver,
      scriptsObserver,
      timelinesObserver,
      previewScriptObserver,
      runTimelineObserver,
      runBoardObserver,
      timelineInfoUserObserver,
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
  
  onDevicesChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.DEVICES_CHANGED);
  }
  
  onScriptsChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.SCRIPTS_CHANGED);
  }
  
  onTimelinesChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.TIMELINES_CHANGED);
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
  
  dispatch = (action) => {
    if (this.store) {
      this.store.dispatch(action);
    }
  }
  
  destroy = () => {
    this.scriptsObserver = null;
    this.store = null;
  }
}