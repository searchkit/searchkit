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
  Examples: ['example-apps-next', 'example-apps-prisma', 'example-apps-aws-lambda', 'example-apps-create-react-app', 'example-apps-express'],
  Guides:  ['guides-elasticsearch-setup-indexing', 'guides-graphql-schema-cheat-sheet', 'guides-setting-query-search', 'v2-v3-migration'],
  Customisations: {
    'Graph QL': [ 'customisations-hit-resolver', 'customisations-graphql-multiple-configurations', 'customisations-graphql-types', 'customisations-ui-add-new-facet-class', ],
    'Components': ['customisations-ui-facet-display']
  }
};
