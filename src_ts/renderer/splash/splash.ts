import domready from 'domready';
import { createElement } from 'react';
import ReactDOM from 'react-dom';

import SplashWindow from './SplashWindow';

domready(() => {
  ReactDOM.render(
    createElement(SplashWindow),
    document.getElementById('root'),
  );
});
