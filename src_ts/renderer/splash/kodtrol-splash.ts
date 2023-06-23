import domready from 'domready';
import { createElement } from 'react';
import ReactDOM from 'react-dom';

import SplashRoot from './SplashRoot';

domready(() => {
  ReactDOM.render(
    createElement(SplashRoot),
    document.getElementById('root'),
  );
});
