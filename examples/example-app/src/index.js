import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  withSearchkit,
  withSearchkitRouting,
} from '@searchkit/client';

const SearchkitApp = withSearchkit(withSearchkitRouting(App));

ReactDOM.render(
  <React.StrictMode>
    <SearchkitApp />
  </React.StrictMode>,
  document.getElementById('root'),
);