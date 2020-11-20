import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CustomApp from './CustomApp';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { SearchkitProvider, SearchkitClient } from '@searchkit/client'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const client = new ApolloClient({
  uri: 'https://demo.searchkit.co/api/graphql',
  cache: new InMemoryCache()
});

const skClient = new SearchkitClient()

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client} >
      <SearchkitProvider client={skClient}>
        <Router>
          <Switch>
            <Route path="/custom">
              <CustomApp />
            </Route>
            <Route path="/">
              <App />
            </Route>
          </Switch>
        </Router>
      </SearchkitProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
