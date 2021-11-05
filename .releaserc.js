module.exports = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: "angular",
        releaseRules: [
          {breaking: true, release: 'major'},
          {type: "feat", release: "minor"},
          {type: "fix", release: "patch"},
          {type: "docs", release: false},
          {type: "style", release: false},
          {type: "refactor", release: "patch"},
          {type: "perf", release: "patch"},
          {type: "test", release: false},
          {type: "chore", release: false},
          {type: "dependencies", release: "minor"},
          // dont trigger another release on release commit
          {type: "release", release: false}
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES']
        }
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            {type: "feat", section: "Features"},
            {type: "fix", section: "Fixes"},
            {type: "docs", hidden: true},
            {type: "style", section: "Style"},
            {type: "refactor", section: "Refactor"},
            {type: "perf", section: "Performance"},
            {type: "test", hidden: true},
            {type: "chore", hidden: true},
            {type: "dependencies", section: "Dependencies"},
            {type: "revert", section: "Reverts"},
            {type: "release", hidden: true}
          ]
        }
      }
    ],
    [
      // Update versions in sub-packages dependencies
      "@google/semantic-release-replace-plugin",
      {
        "replacements": [
          {
            "files": ["packages/*/package.json"],
            "from": "\"mongodb-memory-server-core\": \".*\"",
            "to": "\"mongodb-memory-server-core\": \"${nextRelease.version}\"",
          }
        ]
      }
    ],
    "@semantic-release/changelog",
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
        pkgRoot: './packages/mongodb-memory-server-global-4.0',
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
    ["@semantic-release/git", {
      "assets": ["packages/*/package.json", "CHANGELOG.md"],
      "message": "release: v${nextRelease.version}"
    }],
    "@semantic-release/github"
  ],
  branches: [
    // from what i read in the semantic-release configuration and in some issues, the order has to be like this:
    // other branches
    // main / upstream branch
    // prerelease branches
    { name: "old\\/(\\d+)(\\.x)", range: "${name.replace(/^old\\//g, '')}", prerelease: false },
    "master",
    { name: "beta", prerelease: true }
  ]
};
