module.exports = {
  docs: {
    'Searchkit': [
      'overview',
      'home-how-to-use-searchkit',
      'home-quick-start'
    ],
    'Searchkit API': [
      'searchkit-sdk-core',
      'searchkit-sdk-hits',
      'searchkit-sdk-query',
      'searchkit-sdk-autocomplete',
      'searchkit-sdk-grouping',
      {
        'Filters': [
          'searchkit-sdk-base-filters',
          'searchkit-sdk-filters-value',
          'searchkit-sdk-filters-numeric-range',
          'searchkit-sdk-filters-geo-location',
          'customisations-adding-your-own-filters'
        ],
        'Facets': [
          'searchkit-sdk-facets-refinement-list',
          'searchkit-sdk-facets-hierarchical-refinement-list',
          'searchkit-sdk-facets-range',
          'searchkit-sdk-facets-date-range',
          'searchkit-sdk-facets-geo-distance-location',
          'searchkit-sdk-facets-multi-query-options',
          'searchkit-sdk-facets-conditional-facets',
          'sdk-customisations-ui-add-new-facet-class'
        ]
      },
      'searchkit-sdk-sorting',
      'searchkit-sdk-pagination',
      'searchkit-sdk-customise-elasticsearch-query'
    ],
    'Frontend APIs': [
      'searchkit-client',
      'searchkit-elastic-ui'
    ],
    'Guides': [
      'guides-using-filters',
      'guides-query-boosting-relevance',
      'guides-geo-search',
      'guides-indexing',
      'guides-seo',
      'guides-ssr',
      'guides-url-sync'
    ]
  },
  'graphql': {
    'Overview & Setup': [
      'gql-graphql-overview',
      'gql-base-api-setup',
      'gql-ui-setup',
      'gql-guides-graphql-cheat-sheet'
    ],
    'API': [
      'gql-searchkit-schema'
    ],
    'Guides': [
      'gql-customisations-add-base-filters',
      'gql-customisations-conditional-facets',
      'gql-customisations-graphql-multiple-configurations',
      'gql-customisations-graphql-types',
      'gql-customisations-hit-resolver',
      'gql-customisations-logging',
      'gql-customisations-permissions',
      'gql-filters',
      'gql-guides-highlighting'
    ]

  }
};
