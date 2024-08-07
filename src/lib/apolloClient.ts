import { ApolloClient, InMemoryCache, HttpLink, split, ApolloLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { parseCookies } from 'nookies';

const httpLink = new HttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql',
});

let wsLink: WebSocketLink | null = null;

if (typeof window !== 'undefined') {
  wsLink = new WebSocketLink({
    uri: `ws://frontend-test-api.aircall.dev/graphql`,
    options: {
      reconnect: true,
      connectionParams: () => {
        const cookies = parseCookies();
        return {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        };
      },
    },
  });
}

const authLink = setContext((_, { headers }) => {
  const cookies = parseCookies();
  const token = cookies.token;
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const splitLink = typeof window !== 'undefined' && wsLink !== null
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      authLink.concat(httpLink),
    )
  : authLink.concat(httpLink);

const client = new ApolloClient({
  link: splitLink as ApolloLink,
  cache: new InMemoryCache(),
});

export default client;
