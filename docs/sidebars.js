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
      'customisations-adding-your-own-filters',
      'customisations-query-boosting-relevance',
      'customisations-graphql-multiple-configurations',
      'customisations-graphql-types',
      'customisations-ui-add-new-facet-class',
      'customisations-add-base-filters',
      'customisations-authentication-and-authorisation',
      'customisations-api-logging',
      'customisations-conditional-facets',
      'guides-highlighting',
      'guides-geo-search',
    ],
    'Indexing Guides': ['guides-elasticsearch-setup-indexing'],
    'Frontend Guides': [
      'guides-graphql-schema-cheat-sheet',
      'guides-url-sync',
      'guides-ssr',
      'guides-seo'
    ],
    'Notes': ['v2-v3-migration', 'guides-upgrade-rc41']
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
        'own-components-ui-facet-value-filtering',
        'own-components-hierarchical-facet',
        'own-components-value-facet'
        // range facet
        // date range facet
      ]
    }
  ],
  Examples: [
    { 'API + Frontend': ['example-apps-next'],
     'API only': ['example-apps-prisma', 'example-apps-aws-lambda', 'example-apps-express' ],
      'Frontend only': ['example-apps-create-react-app'],
      'Tutorials': [
        {
          type: 'link',
          label: "How to build a GraphQL API with AWS Lambda, Elasticsearch and Searchkit",
          href: "https://dev.to/joemcelroy/search-ui-graphql-api-with-elasticsearch-searchkit-4jp7"
        }
      ]
  }]
};
