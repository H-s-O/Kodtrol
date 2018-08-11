import React, { PureComponent } from 'react';
import { createStore, applyMiddleware } from 'redux'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import { Provider } from 'react-redux'
import createIpc, { send } from 'redux-electron-ipc';
import { composeWithDevTools } from 'redux-devtools-extension';

import Main from './Main';
import appReducer from '../../common/js/store/reducers/app';
// import { updateScripts, editScript, updateDevices, updateTimelines, editTimeline, updateTimelineInfo } from './actions/ipc';

export default class Root extends PureComponent {
  store = null;
  
  constructor(props) {
    super(props);
    
    // const ipc = createIpc({
    //   'updateScripts': updateScripts,
    //   'editScript': editScript,
    //   'editTimeline': editTimeline,
    //   'updateDevices': updateDevices,
    //   'updateTimelines': updateTimelines,
    //   'updateTimelineInfo': updateTimelineInfo,
    // });
    
    const initialState = getInitialStateRenderer();

    this.store = createStore(
      appReducer, 
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