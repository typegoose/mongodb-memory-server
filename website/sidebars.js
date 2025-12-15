module.exports = {
  api: {
    Start: ['api/index-api', 'api/config-options'],
    Classes: [
      'api/classes/mongo-memory-server',
      'api/classes/mongo-memory-replset',
      'api/classes/mongo-instance',
      'api/classes/mongo-binary',
      'api/classes/dry-mongo-binary',
    ],
    Enums: ['api/enums/mongo-memory-server-states', 'api/enums/mongo-memory-replset-states'],
    Interfaces: [
      'api/interfaces/mongo-memory-server-opts',
      'api/interfaces/mongo-memory-server-automaticauth',
      'api/interfaces/mongo-memory-server-createuser',
      'api/interfaces/mongo-memory-instance-opts',
      'api/interfaces/mongo-memory-instance-replicamemberconfig',
      'api/interfaces/mongo-memory-binary-opts',
      'api/interfaces/mongo-memory-replset-opts',
      'api/interfaces/mongo-memory-dispose-opts',
      'api/interfaces/replset-opts',
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
        'Integration Examples': [
          'guides/integration-examples/test-runners',
          'guides/integration-examples/docker',
        ],
      },
      'guides/enable-debug-mode',
      'guides/known-issues',
      'guides/error-warning-details',
      'guides/mongodb-server-versions',
      'guides/common-issues',
    ],
    Migration: [
      'guides/migration/migrate11',
      'guides/migration/migrate10',
      'guides/migration/migrate9',
      'guides/migration/migrate8',
      'guides/migration/migrate7',
    ],
  },
};
