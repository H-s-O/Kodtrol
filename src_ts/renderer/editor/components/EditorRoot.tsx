import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import { observer, observe } from 'redux-observers';

import Editor from './Editor';
import reducers from '../store/reducers/index';
import isDev from '../../../../src/common/js/lib/isDev';
import { KodtrolState } from '../../../common/types';

const createKodtrolStore = (initialData?: object) => {
  const store = createStore(
    reducers,
    initialData,
  );

  const createSender = (toKey: string) => (dispatch, curr, prev) => {
    // if (window.kodtrol.messagePort) {
    //   window.kodtrol.messagePort.postMessage({
    //     [toKey]: curr,
    //   })
    // }
  }

  const outputsObserver = observer(
    (state: KodtrolState) => state.outputs, createSender('updateOutputs')
  );
  const inputsObserver = observer(
    (state: KodtrolState) => state.inputs, createSender('updateInputs')
  );
  const devicesObserver = observer(
    (state: KodtrolState) => state.devices, createSender('updateDevices')
  );
  const scriptsObserver = observer(
    (state: KodtrolState) => state.scripts, createSender('updateScripts')
  );
  const mediasObserver = observer(
    (state: KodtrolState) => state.medias, createSender('updateMedias')
  );
  const timelinesObserver = observer(
    (state: KodtrolState) => state.timelines, createSender('updateTimelines')
  );
  const boardsObserver = observer(
    (state: KodtrolState) => state.boards, createSender('updateBoards')
  );
  const runDeviceObserver = observer(
    (state: KodtrolState) => state.runDevice, createSender('runDevice')
  );
  const runScriptObserver = observer(
    (state: KodtrolState) => state.runScript, createSender('runScript')
  );
  const runTimelineObserver = observer(
    (state: KodtrolState) => state.runTimeline, createSender('runTimeline')
  );
  const runBoardObserver = observer(
    (state: KodtrolState) => state.runBoard, createSender('runBoard')
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

export type AppDispatch = ReturnType<typeof createKodtrolStore>['dispatch'];
export type DispatchFunc = () => AppDispatch;

type RootProps = {
  projectData: object
};

export default function EditorRoot(props: RootProps) {
  const store = useMemo(() => createKodtrolStore(props.projectData), []);

  return (
    <Provider
      store={store}
    >
      <Editor />
    </Provider>
  );
}
