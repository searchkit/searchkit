module.exports = {
  docs: {
    'Getting Started': [
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
    ]
  },
  Examples: [
    { 'API + Frontend': ['example-apps-next'],
     'API only': ['example-apps-prisma', 'example-apps-aws-lambda', 'example-apps-express' ],
      'Frontend only': ['example-apps-create-react-app']
  }],
  Guides:  [{ 'Guides': [
    'guides-elasticsearch-setup-indexing',
    'guides-graphql-schema-cheat-sheet',
    'guides-url-sync',
    'guides-ssr',
    'guides-highlighting'
  ]}, {
    'Upgrade Notes': ['v2-v3-migration', 'guides-upgrade-rc25']
  }],
  Customisations: {
    'GraphQL API': [ 'customisations-hit-resolver', 'customisations-graphql-multiple-configurations', 'customisations-graphql-types', 'customisations-ui-add-new-facet-class', 'customisations-add-base-filters' ],
    'Components': ['customisations-ui-facet-display']
  }
};
