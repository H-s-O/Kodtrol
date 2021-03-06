import React, { PureComponent } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import Main from './Main';
import * as appReducers from '../../common/js/store/reducers/index';
import resetRunningItems from '../../common/js/store/middlewares/resetRunningItems';
import resetCurrentItems from '../../common/js/store/middlewares/resetCurrentItems';
import resetTimelineInfoUser from '../../common/js/store/middlewares/resetTimelineInfoUser';
import resetTimelineInfo from '../../common/js/store/middlewares/resetTimelineInfo';
import resetBoardInfoUser from '../../common/js/store/middlewares/resetBoardInfoUser';
import resetBoardInfo from '../../common/js/store/middlewares/resetBoardInfo';

import styles from '../styles/root.scss';

export default class Root extends PureComponent {
  store = null;
  
  constructor(props) {
    super(props);
  
    const initialState = getInitialStateRenderer();

    this.store = createStore(
      combineReducers(appReducers), 
      initialState,
      composeWithDevTools(
        applyMiddleware(
          forwardToMain, // IMPORTANT! This goes first
          resetCurrentItems(),
          resetRunningItems(),
          resetTimelineInfo(),
          resetTimelineInfoUser(),
          resetBoardInfo(),
          resetBoardInfoUser(),
        ),
      ),
    );
    replayActionRenderer(this.store);

  }
  
  componentDidMount = () => {
    // Hack to disable annoying spacebar scroll behavior
    // @see https://stackoverflow.com/a/22559917
    window.addEventListener('keydown', function(e) {
      if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
      }
    });
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