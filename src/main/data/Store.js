import EventEmitter from 'events';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import { observer, observe } from 'redux-observers'

import * as StoreEvent from '../events/StoreEvent';
import * as appReducers from '../../common/js/store/reducers/index';

export default class Store extends EventEmitter {
  store = null;
  
  constructor(initialState = null) {
    super();
    
    this.store = createStore(
      combineReducers(appReducers),
      initialState,
      applyMiddleware(
        forwardToRenderer,
      ),
    );
    
    const scriptsObserver = observer(
      (state) => {
        return state.scripts;
      },
      this.onScriptsChange
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
    
    observe(this.store, [
      scriptsObserver,
      previewScriptObserver,
      runTimelineObserver,
    ]);
    replayActionMain(this.store);
  }
  
  get state() {
    if (this.store) {
      return this.store.getState();
    }
    
    return null;
  }
  
  onScriptsChange = (dispatch, current, previous) => {
    this.emit(StoreEvent.SCRIPTS_CHANGED);
  }
  
  onPreviewScript = (dispatch, current, previous) => {
    this.emit(StoreEvent.PREVIEW_SCRIPT);
  }
  
  onRunTimeline = (dispatch, current, previous) => {
    this.emit(StoreEvent.RUN_TIMELINE);
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