import domready from 'domready';
import React from 'react';
import ReactDOM from 'react-dom';

import Main from './js/Main';

domready(() => {
  ReactDOM.render(
    <Main />,
    document.getElementById('root'),
  );
});
