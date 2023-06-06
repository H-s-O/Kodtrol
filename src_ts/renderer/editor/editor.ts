/// <reference path="editor-preload.d.ts" />

import { createElement } from 'react';
import domready from 'domready';
import ReactDOM from 'react-dom';

// import { isWin } from '../common/js/lib/platforms';
const isWin = true;
import Root from './components/Root';

domready(() => {
  window.kodtrol_editor.readProjectFile()
    .then((projectData) => {
      ReactDOM.render(
        createElement(Root, { projectData }),
        document.getElementById('root'),
      );
    });
});

// Hack to disable annoying spacebar scroll behavior
// @see https://stackoverflow.com/a/22559917
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' && e.target === document.body) {
    e.preventDefault();
  }
});

// Hack to fix Chromium's bug on Windows where a "mousemove" event is always emitted
// after a "contextmenu" event whether the mouse actually moved or not
if (isWin) {
  window.addEventListener('contextmenu', () => {
    window.addEventListener('mousemove', (e) => {
      e.stopImmediatePropagation();
    }, { capture: true, once: true });
  }, { capture: true });
}
