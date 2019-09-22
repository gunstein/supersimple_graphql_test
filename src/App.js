import React from "react";
import { ApolloClient } from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
//import { onError } from "apollo-link-error";
//import apolloLogger from 'apollo-link-logger';

import NewMessageForm from "./NewMessageForm";
import MessageList from "./MessageList";

const httpLink = new HttpLink({
  uri: "https://globetotter.herokuapp.com/v1/graphql"
});
const wsLink = new WebSocketLink({
  uri: "wss://globetotter.herokuapp.com/v1/graphql",
  options: {
    reconnect: true
  }
});
/*
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});
*/
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink /*,
  errorLink*/
);
const cache = new InMemoryCache();
const client = new ApolloClient({ link, cache });

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h1>Simple Chat</h1>
      <NewMessageForm />
      <MessageList />
    </div>
  </ApolloProvider>
);

export default App;
