import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import App from './App.jsx';
import './index.css';

// Cliente Apollo: HttpLink envía las operaciones al backend
// e InMemoryCache conserva los resultados en el navegador.
const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache()
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
