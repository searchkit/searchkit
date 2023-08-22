import './style.css'
import Searchkit, { SearchkitConfig } from 'searchkit'
import SearchkitInstantsearchClient from '@searchkit/instantsearch-client'
import instantsearch from 'instantsearch.js'
import {
  searchBox,
  refinementList,
  hits,
  pagination,
  rangeInput,
  rangeSlider
} from 'instantsearch.js/es/widgets'

const config: SearchkitConfig = {
  connection: {
    host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
    // if you're using Elastic cloud
    // cloud_id: "<cloud-id-found-on-deployment-page>",
    // if you are authenticating with api key
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-api-key
    apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
    // if you are authenticating with username/password
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-usernamepassword
    //auth: {
    //  username: "elastic",
    //  password: "changeme"
    //},
  },
  search_settings: {
    highlight_attributes: ['title'],
    search_attributes: [{ field: 'title', weight: 3 }, 'actors', 'plot'],
    result_attributes: ['title', 'actors', 'poster', 'plot'],
    facet_attributes: [
      { attribute: 'type', field: 'type', type: 'string' },
      { attribute: 'actors', field: 'actors.keyword', type: 'string' },
      { attribute: 'imdbrating', type: 'numeric', field: 'imdbrating' },
      { attribute: 'metascore', type: 'numeric', field: 'metascore' }
    ],
    sorting: {
      default: {
        field: '_score',
        order: 'desc'
      },
      _rated_desc: {
        field: 'rated',
        order: 'desc'
      }
    },
    snippet_attributes: ['plot'],
    query_rules: []
  }
}

const searchkitClient = new Searchkit(config)
const searchClient = SearchkitInstantsearchClient(searchkitClient)

const search = instantsearch({
  indexName: 'imdb_movies',
  searchClient: searchClient as any
})

search.addWidgets([
  searchBox({
    container: '#searchbox'
  }),
  refinementList({
    container: '#type-list',
    attribute: 'type'
  }),
  refinementList({
    container: '#actors-list',
    attribute: 'actors',
    searchable: true
  }),
  rangeInput({
    attribute: 'imdbrating',
    container: '#rating-range'
  }),
  rangeSlider({
    attribute: 'metascore',
    container: '#metascore-range'
  }),
  hits({
    container: '#hits',
    templates: {
      item(hit, { html, components }) {
        return html`
          <div>
            <h2>${components.Highlight({ attribute: 'title', hit })}</h2>
            <p>${components.Snippet({ attribute: 'plot', hit })}</p>
          </div>
        `
      }
    }
  }),
  pagination({
    container: '#pagination'
  })
])

search.start()
