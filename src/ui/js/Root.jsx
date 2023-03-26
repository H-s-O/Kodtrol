import React, { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import { observer, observe } from 'redux-observers';

import Main from './Main';
import reducers from '../../common/js/store/reducers/index';
import isDev from '../../common/js/lib/isDev';

// const store = createStore(
//   reducers,
//   // getInitialStateRenderer(),
//   // (isDev ? require('redux-devtools-extension').composeWithDevTools : compose)(
//   //   applyMiddleware(
//   //     forwardToMain, // IMPORTANT! This goes first
//   //   ),
//   // ),
// );
// // replayActionRenderer(store);

const createKodtrolStore = (initialData = undefined) => {
  const store = createStore(
    reducers,
    initialData,
  );

  const createSender = (toKey) => (dispatch, curr, prev) => {
    if (window.kodtrol.messagePort) {
      window.kodtrol.messagePort.postMessage({
        [toKey]: curr,
      })
    }
  }

  const outputsObserver = observer(
    (state) => state.outputs, createSender('updateOutputs')
  );
  const inputsObserver = observer(
    (state) => state.inputs, createSender('updateInputs')
  );
  const devicesObserver = observer(
    (state) => state.devices, createSender('updateDevices')
  );
  const scriptsObserver = observer(
    (state) => state.scripts, createSender('updateScripts')
  );
  const mediasObserver = observer(
    (state) => state.medias, createSender('updateMedias')
  );
  const timelinesObserver = observer(
    (state) => state.timelines, createSender('updateTimelines')
  );
  const boardsObserver = observer(
    (state) => state.boards, createSender('updateBoards')
  );
  const runDeviceObserver = observer(
    (state) => state.runDevice, createSender('runDevice')
  );
  const runScriptObserver = observer(
    (state) => state.runScript, createSender('runScript')
  );
  const runTimelineObserver = observer(
    (state) => state.runTimeline, createSender('runTimeline')
  );
  const runBoardObserver = observer(
    (state) => state.runBoard, createSender('runBoard')
  );
  // const consoleObserver = observer(
  //   (state) => state.console,
  //   this.onConsoleChange
  // );

  observe(store, [
    outputsObserver,
    inputsObserver,
    devicesObserver,
    scriptsObserver,
    mediasObserver,
    timelinesObserver,
    boardsObserver,
    runDeviceObserver,
    runScriptObserver,
    runTimelineObserver,
    runBoardObserver,
    // consoleObserver,
  ], {
    skipInitialCall: false,
  });

  return store;
};

export default function Root(props) {
  const store = useMemo(() => createKodtrolStore(props.projectData), [])

  return (
    <Provider
      store={store}
    >
      <Main />
    </Provider>
  );
}
