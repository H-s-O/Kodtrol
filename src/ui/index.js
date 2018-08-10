import domready from 'domready';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './js/Root';

domready(() => {
  ReactDOM.render(
    <Root />,
    document.getElementById('root'),
  );
});
