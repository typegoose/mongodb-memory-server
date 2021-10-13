module.exports = {
  api: {
    Start: ['api/index-api', 'api/config-options'],
    Classes: [
      'api/classes/mongo-memory-server',
      'api/classes/mongo-memory-replset',
      'api/classes/mongo-instance',
      'api/classes/mongo-binary',
    ],
  },
  guides: {
    'Getting Started': [
      'guides/quick-start-guide',
      'guides/faq',
      'guides/known-issues',
      'guides/supported-systems',
    ],
    Guides: [
      {
        'Integration Examples': ['guides/integration-examples/test-runners'],
        Miscellaneous: [
          'guides/enable-debug-mode',
          'guides/known-issues',
          'guides/error-warning-details',
        ],
      },
    ],
    Migration: ['guides/migrate7'],
  },
};
