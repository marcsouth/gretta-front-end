import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { ApolloProvider } from '@apollo/client';
import App from './App';
import { ApolloClient, InMemoryCache } from '@apollo/client';


//link to online, make sure to deploy it again : https://gretta-backend-production.up.railway.app/  

const client = new ApolloClient({
  uri: 'https://gretta-backend-production.up.railway.app/', 
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
