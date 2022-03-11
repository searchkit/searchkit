module.exports = {
  docs: {
    'Quick Guide': [
      'overview',
      'setup-basic-setup'
    ],
    Reference: [
      'searchkit-sdk',
      'searchkit-client',
      'searchkit-elastic-ui',
    ],
    'Frontend Guides': [
      'guides-url-sync'
    ],
    'Getting Data into Elasticsearch': [
      'guides-elasticsearch-setup-indexing'
    ],
    'Notes': ['v2-v3-migration', 'guides-upgrade-rc41'],
    'SDK Guides': [
      'sdk-customisations-adding-your-own-filters',
      'customisations-query-boosting-relevance',
      'sdk-customisations-ui-add-new-facet-class',
      'sdk-guides-using-filters',
      'customisations-conditional-facets'
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
    Reference: [
      'searchkit-schema'
    ],
    'Frontend Guides': [
      'guides-ssr',
      'guides-seo'
    ],
    'API Guides': [
      'customisations-adding-your-own-filters',
      'customisations-ui-add-new-facet-class',
      'customisations-add-base-filters',
      'guides-using-filters',
      'guides-graphql-schema-cheat-sheet',
      'customisations-hit-resolver',
      'customisations-graphql-multiple-configurations',
      'customisations-graphql-types',
      'customisations-authentication-and-authorisation',
      'customisations-api-logging'
    ],
  }],
};
