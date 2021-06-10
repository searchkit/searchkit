module.exports = {
  docs: {
    'Quick Guide': [
      'overview',
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
      'searchkit-schema',
      'searchkit-client',
      'searchkit-elastic-ui',
    ],
    'API Guides': [
      'customisations-hit-resolver',
      'customisations-graphql-multiple-configurations',
      'customisations-graphql-types',
      'customisations-ui-add-new-facet-class',
      'customisations-add-base-filters',
      'customisations-authentication-and-authorisation',
      'customisations-api-logging'
    ],
    'Indexing Guides': ['guides-elasticsearch-setup-indexing'],
    'Frontend Guides': [
      'guides-graphql-schema-cheat-sheet',
      'guides-url-sync',
      'guides-ssr',
      'guides-highlighting',
      'guides-geo-search',
      'guides-seo'
    ],
    'Notes': ['v2-v3-migration', 'guides-upgrade-rc25']
  },
  'UI Docs': [
    'own-components',
    'own-components-ui-search-query',
    'own-components-ui-result-list-hits',
    'own-components-ui-summary',
    'own-components-ui-selected-filters',
    'own-components-ui-pagination',
    // sorting
    {
      'Facets': [
        'own-components-ui-facet-display',
        'own-components-ui-facet-value-filtering'
        // list facet
        // range facet
        // date range facet
      ]
    }
  ],
  Examples: [
    { 'API + Frontend': ['example-apps-next'],
     'API only': ['example-apps-prisma', 'example-apps-aws-lambda', 'example-apps-express' ],
      'Frontend only': ['example-apps-create-react-app']
  }]
};
