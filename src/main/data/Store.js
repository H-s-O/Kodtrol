import EventEmitter from 'events';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';
import { observer, observe } from 'redux-observers'

import { SCRIPTS_CHANGED } from '../events/StoreEvent';
import appReducers from '../../common/js/store/reducers/index';

export default class Store extends EventEmitter {
  store = null;
  scriptsObserver = null;
  
  constructor(initialState = null) {
    super();
    
    this.store = createStore(
      combineReducers(appReducers),
      initialState,
      applyMiddleware(
        forwardToRenderer,
      ),
    );
    
    this.scriptsObserver = observer(
      (state) => state.scripts.map((script) => script.content),
      this.onScriptsChange
    );
    
    observe(this.store, [
      this.scriptsObserver,
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
    this.emit(SCRIPTS_CHANGED);
  }
  
  dispatch = (action) => {
    if (this.store) {
      this.store.dispatch(action);
    }
  }
  
  destroy = () => {
    this.scriptsObserver(); // unsubscribe
    this.scriptsObserver = null;
    
    this.store = null;
  }
}