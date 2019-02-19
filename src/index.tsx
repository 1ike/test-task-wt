import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Router } from 'react-router-dom';

import App from './App';
import history from './services/history';

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root')
);
