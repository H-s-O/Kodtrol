import domready from 'domready';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createIpc, { send } from 'redux-electron-ipc';

import Main from './js/Main';
import main from './js/reducers/main';
import { updateScripts, editScript, updateDevices, updateTimelines, editTimeline } from './js/actions/ipc';

const ipc = createIpc({
  'updateScripts': updateScripts,
  'editScript': editScript,
  'editTimeline': editTimeline,
  'updateDevices': updateDevices,
  'updateTimelines': updateTimelines,
});

const store = createStore(main, applyMiddleware(ipc));

domready(() => {
  ReactDOM.render(
    <Provider
      store={store}
    >
      <Main />
    </Provider>,
    document.getElementById('root'),
  );
});
