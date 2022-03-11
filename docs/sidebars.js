module.exports = {
  docs: {
    'Quick Guide': [
      'overview',
      'setup-basic-setup'
    ],
    Reference: [
      'searchkit-sdk',
      'searchkit-schema',
      'searchkit-client',
      'searchkit-elastic-ui',
    ],
    'Frontend Guides': [
      'guides-url-sync',
      'guides-ssr',
      'guides-seo'
    ],
    'Getting Data into Elasticsearch': [
      'guides-elasticsearch-setup-indexing'
    ],
    'Notes': ['v2-v3-migration', 'guides-upgrade-rc41'],
    'SDK Guides': [
      'customisations-adding-your-own-filters',
      'customisations-query-boosting-relevance',
      'customisations-ui-add-new-facet-class',
      'customisations-add-base-filters',
      'guides-using-filters',
      'customisations-conditional-facets',
      'guides-highlighting',
      'guides-geo-search',
    ],
    'UI Docs': [
      'own-components',
      'own-components-ui-search-query',
      'own-components-ui-result-list-hits',
      'own-components-ui-summary',
      'own-components-ui-selected-filters',
      'own-components-ui-pagination',
      {
        'Facets': [
          'own-components-ui-facet-display',
          'own-components-ui-facet-value-filtering',
          'own-components-hierarchical-facet',
          'own-components-value-facet'
        ]
      }
    ],
  },
  'GraphQL Integration': [{
    'Quick Guide': [
      'graphql-overview',
      'api-setup',
      {
        'UI setup': [
          'base-ui-setup',
          'ui-setup-eui',
          'ui-setup-own-components',
        ],
      }
    ],
    'API Guides': [
      'guides-graphql-schema-cheat-sheet',
      'customisations-hit-resolver',
      'customisations-graphql-multiple-configurations',
      'customisations-graphql-types',
      'customisations-authentication-and-authorisation',
      'customisations-api-logging'
    ],
  }],
};
