import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { ApolloProvider } from '@apollo/client';
import App from './App';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000', // Replace with your Apollo Server's URL
  cache: new InMemoryCache(),
});

const root = createRoot(document.getElementById('root')); // Create a root

root.render( // Use root.render instead of ReactDOM.render
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
