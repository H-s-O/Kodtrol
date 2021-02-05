import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';

import Main from './Main';
import reducers from '../../common/js/store/reducers/index';
import isDev from '../../common/js/lib/isDev';

const store = createStore(
  reducers,
  getInitialStateRenderer(),
  (isDev ? require('redux-devtools-extension').composeWithDevTools : compose)(
    applyMiddleware(
      forwardToMain, // IMPORTANT! This goes first
    ),
  ),
);
replayActionRenderer(store);

export default function Root(props) {
  return (
    <Provider
      store={store}
    >
      <Main />
    </Provider>
  );
}
