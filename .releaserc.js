module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      // Update versions in sub-packages dependencies
      "@google/semantic-release-replace-plugin",
      {
        "replacements": [
          {
            "files": ["packages/*/package.json"],
            "from": "\"mongodb-memory-server\": \".*\"",
            "to": "\"mongodb-memory-server\": \"${nextRelease.version}\"",
          },
          {
            "files": ["packages/*/package.json"],
            "from": "\"mongodb-memory-server-core\": \".*\"",
            "to": "\"mongodb-memory-server-core\": \"${nextRelease.version}\"",
          }
        ]
      }
    ],
    "@semantic-release/changelog",
    ["@semantic-release/git", {
      "assets": ["packages/*/package.json", "CHANGELOG.md"],
      "message": "v${nextRelease.version}\n\n[skip ci]"
    }],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './packages/mongodb-memory-server-core',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './packages/mongodb-memory-server',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './packages/mongodb-memory-server-global',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './packages/mongodb-memory-server-global-3.6',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './packages/mongodb-memory-server-global-4.2',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: './packages/mongodb-memory-server-global-4.4',
      },
    ],
    "@semantic-release/github"
  ],
};
