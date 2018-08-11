import EventEmitter from 'events';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';

import appReducers from '../../common/js/store/reducers/index';

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
    
    replayActionMain(this.store);
  }
  
  get state() {
    if (this.store) {
      return this.store.getState();
    }
    
    return null;
  }
  
  dispatch = (action) => {
    if (this.store) {
      this.store.dispatch(action);
    }
  }
  
  destroy = () => {
    this.store = null;
  }
}