import domready from 'domready';
import React from 'react';
import ReactDOM from 'react-dom';

import { isWin } from '../common/js/lib/platforms';
import Root from './js/Root';

domready(() => {
  ReactDOM.render(
    <Root />,
    document.getElementById('root'),
  );
});

// Hack to disable annoying spacebar scroll behavior
// @see https://stackoverflow.com/a/22559917
window.addEventListener('keydown', (e) => {
  if (e.keyCode === 32 && e.target === document.body) {
    e.preventDefault();
  }
});

// Hack to fix Chromium's bug on Windows where a "mousemove" event is always emitted
// after a "contextmenu" event whether the mouse actually moved or not
if (isWin) {
  window.addEventListener('contextmenu', () => {
    window.addEventListener('mousemove', (e) => {
      e.stopImmediatePropagation()
    }, { capture: true, once: true })
  }, { capture: true })
}
