import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.t.hmny.io/subgraphs/name/fatex-dao/fatex-dex',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.t.hmny.io:8030/graphql',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const stakingClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/way2rach/talisman',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const blockClient = new ApolloClient({
  link: new HttpLink({
    // uri: 'https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-blocks',
    uri: 'https://graph.t.hmny.io/subgraphs/name/fatex-dao/harmony-blocks',
  }),
  cache: new InMemoryCache(),
})
