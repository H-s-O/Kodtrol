import domready from 'domready';
import React from 'react';
import ReactDOM from 'react-dom';

import ConsoleWindow from './js/ConsoleWindow';

domready(() => {
  ReactDOM.render(
    <ConsoleWindow />,
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
