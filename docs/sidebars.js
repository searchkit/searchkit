/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

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
      },
      'customise-searchkit',
    ],
    Reference: [
      'searchkit-apollo-resolver',
      'searchkit-client',
      'searchkit-elastic-ui',
    ],
    Examples: ['example-apps-next', 'example-apps-prisma', 'example-apps-aws-lambda', 'example-apps-create-react-app', 'example-apps-express'],
  },
  Guides:  ['guides', 'guides-elasticsearch-setup-indexing', 'guides-graphql-schema-cheat-sheet', 'guides-setting-query-search', 'v2-v3-migration']
};
