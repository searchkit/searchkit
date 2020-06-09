import ResultsResolver, { SearchkitConfig } from './ResultsResolver'
import HitsResolver from './HitsResolver'
import FacetsResolver from './FacetsResolver'
import SummaryResolver from './SummaryResolver'

export default (config: SearchkitConfig) => ({
  ResultSet: {
    hits: HitsResolver,
    facets: FacetsResolver,
    // facet: FacetResolver,
    summary: SummaryResolver
  },
  Query: {
    results: ResultsResolver(config)
  },
  FacetSet: {
    __resolveType: (e) => e.type
  }
})
