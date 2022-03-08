import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SearchkitClient, SearchkitProvider } from '@searchkit/client';

const skClient = new SearchkitClient()

ReactDOM.render(
  <React.StrictMode>
   <SearchkitProvider client={skClient}>
      <App />
    </SearchkitProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
