import domready from 'domready';
import React from 'react';
import ReactDOM from 'react-dom';

import SplashWindow from './js/SplashWindow';

domready(() => {
  ReactDOM.render(
    <SplashWindow />,
    document.getElementById('root'),
  );
});
