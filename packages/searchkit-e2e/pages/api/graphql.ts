import Server from '../../server'
import { SearchkitConfig } from '@searchkit/apollo-resolvers'

const searchkitConfig: SearchkitConfig = {
  host: process.env.ES_HOST || "http://localhost:9200/movies/_search",
  hits: {
    fields: ["actors", "writers"]
  }
  // query: new QueryFilter({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
  // facets: [
  //   new RefinementFacetFilter({ field: 'type.raw', id: 'type', label: 'Type' }),
  //   new RefinementFacetFilter({
  //     field: 'actors.raw',
  //     id: 'actors',
  //     label: 'Actors'
  //   }),
  //   new RefinementFacetFilter({
  //     field: 'writers.raw',
  //     id: 'writers',
  //     label: 'Writers',
  //     selector: 'OR'
  //   }),
  //   new RefinementFacetFilter({ field: 'countries.raw', id: 'countries', label: 'Countries' }),
  //   new RefinementFacetFilter({ field: 'genres.raw', id: 'genres', label: 'Genres' }),
  //   new RefinementFacetFilter({
  //     field: 'rated.raw',
  //     id: 'rated',
  //     label: 'Rated',
  //     visibility: [OnFilterSelection({ filterId: 'type' })]
  //   })
  // ]
};

export const config = {
  api: {
    bodyParser: false
  }
}

const server = new Server(searchkitConfig)
export default server.setupApolloServer()
