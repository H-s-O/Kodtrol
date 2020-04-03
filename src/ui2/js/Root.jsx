import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';

import Main from './Main';
import rootReducer from '../../common/js/store/reducers/root';
import resetRunningItems from '../../common/js/store/middlewares/resetRunningItems';
import resetCurrentItems from '../../common/js/store/middlewares/resetCurrentItems';
import resetTimelineInfoUser from '../../common/js/store/middlewares/resetTimelineInfoUser';
import resetTimelineInfo from '../../common/js/store/middlewares/resetTimelineInfo';
import resetBoardInfoUser from '../../common/js/store/middlewares/resetBoardInfoUser';
import resetBoardInfo from '../../common/js/store/middlewares/resetBoardInfo';
import isDev from '../../common/js/lib/isDev';

const store = createStore(
  rootReducer,
  getInitialStateRenderer(),
  (isDev ? require('redux-devtools-extension').composeWithDevTools : compose)(
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
