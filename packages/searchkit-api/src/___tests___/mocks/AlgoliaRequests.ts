export const SimpleRequest = [
  {
    indexName: "imdb_movies",
    params: {
      facetFilters: [["type:movie"]],
      facets: ["*"],
      highlightPostTag: "</ais-highlight-0000000000>",
      highlightPreTag: "<ais-highlight-0000000000>",
      maxValuesPerFacet: 10,
      page: 0,
      query: "shawshank",
      tagFilters: "",
    },
  },
];

export const nonDynamicFacetRequest = [
  {
    indexName: "imdb_movies",
    params: {
      facets: ["type", "actors", "imdbrating"],
      highlightPostTag: "</ais-highlight-0000000000>",
      highlightPreTag: "<ais-highlight-0000000000>",
      maxValuesPerFacet: 10,
      page: 0,
      query: "",
      tagFilters: "",
    },
  },
];

export const DisjunctiveExampleRequest = [
  {
    indexName: "imdb_movies",
    params: {
      facetFilters: [["type:movie"]],
      facets: ["*"],
      highlightPostTag: "</ais-highlight-0000000000>",
      highlightPreTag: "<ais-highlight-0000000000>",
      maxValuesPerFacet: 10,
      page: 0,
      query: "shawshank",
      tagFilters: "",
    },
  },
  {
    indexName: "imdb_movies",
    params: {
      analytics: false,
      attributesToHighlight: [],
      attributesToRetrieve: [],
      attributesToSnippet: [],
      clickAnalytics: false,
      facets: "type",
      highlightPostTag: "</ais-highlight-0000000000>",
      highlightPreTag: "<ais-highlight-0000000000>",
      hitsPerPage: 1,
      maxValuesPerFacet: 10,
      page: 0,
      query: "shawshank",
      tagFilters: "",
    },
  },
];

export const FacetQueryExampleRequest = [
  {
    indexName: "imdb_movies",
    params: {
      facetName: "type",
      facetQuery: "m",
      facets: ["*"],
      highlightPostTag: "</ais-highlight-0000000000>",
      highlightPreTag: "<ais-highlight-0000000000>",
      maxFacetHits: 10,
      maxValuesPerFacet: 10,
      page: 0,
      query: "",
      tagFilters: "",
    },
  },
];

export const NumericFiltersExampleRequest = [
  {
    indexName: "imdb_movies",
    params: {
      facets: ["type", "actors", "imdbrating"],
      highlightPostTag: "</ais-highlight-0000000000>",
      highlightPreTag: "<ais-highlight-0000000000>",
      maxValuesPerFacet: 10,
      numericFilters: ["imdbrating>=90"],
      page: 0,
      query: "",
      tagFilters: "",
    },
  },
  {
    indexName: "imdb_movies",
    params: {
      analytics: false,
      clickAnalytics: false,
      facets: "imdbrating",
      highlightPostTag: "</ais-highlight-0000000000>",
      highlightPreTag: "<ais-highlight-0000000000>",
      hitsPerPage: 0,
      maxValuesPerFacet: 10,
      page: 0,
      query: "",
    },
  },
];
