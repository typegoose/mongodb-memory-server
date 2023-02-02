module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
        diagnostics: true,
      },
    ],
  },
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  testMatch: ['**/__tests__/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts', // include all files, even files that have no tests yet (or are never called)
    '!<rootDir>/src/util/postinstallHelper.ts', // exclude this file, because it is only made for postInstall, not tests
  ],
  globalSetup: '<rootDir>/src/__tests__/testUtils/globalSetup.ts',
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
};
