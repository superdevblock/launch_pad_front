
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';

export const VotingString2Types = {
  "Single choice voting": "single-choice",
  "Approval voting": "approval",
  "Quadratic voting": "quadratic",
  "Ranked choice voting": "ranked-choice",
  "Weighted voting": "weighted",
  "Basic voting": "basic",
}

export const VotingTypes2String = {
  "single-choice": "Single choice voting",
  "approval": "Approval voting",
  "quadratic": "Quadratic voting",
  "ranked-choice": "Ranked choice voting",
  "weighted": "Weighted voting",
  "basic": "Basic voting",
}

export const getApolloClient = (uri) => {
    const httpLink = createHttpLink({
        uri: uri
      });
    const apolloClient = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache({
          addTypename: false
        }),
        defaultOptions: {
          query: {
            fetchPolicy: 'no-cache'
          }
        },
        typeDefs: gql`
          enum OrderDirection {
            asc
            desc
          }
        `
      });
    return apolloClient
}
