import EventEmitter from 'events';
import { createStore, applyMiddleware } from 'redux'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';

import appReducer from '../../common/js/store/reducers/app';
import initialState from '../../common/js/store/initialState';

export default class Store extends EventEmitter {
  store = null;
  
  constructor() {
    super();
    
    this.store = createStore(
      appReducer,
      initialState,
      applyMiddleware(
        forwardToRenderer,
      ),
    );
    
    replayActionMain(this.store);
  }
  
  destroy = () => {
    // not needed !?
  }
}