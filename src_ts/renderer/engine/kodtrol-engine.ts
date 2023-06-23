import Engine from './Engine';

window.onmessage = (event) => {
  if (event.source === window && event.data === 'port') {
    window.kodtrol_editorPort = event.ports[0];
  }

  new Engine(window.kodtrol_editorPort);
};
