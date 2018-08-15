import React, { PureComponent } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import Main from './Main';
import appReducers from '../../common/js/store/reducers/index';

export default class Root extends PureComponent {
  store = null;
  
  constructor(props) {
    super(props);
  
    const initialState = getInitialStateRenderer();

    this.store = createStore(
      combineReducers(appReducers), 
      initialState,
      composeWithDevTools(
        applyMiddleware(forwardToMain),
      ),
    );
    replayActionRenderer(this.store);
  }
  
  render = () => {
    return (
      <Provider
        store={this.store}
      >
        <Main />
      </Provider>
    );
  }
}