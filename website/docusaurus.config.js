/* eslint-disable @typescript-eslint/no-var-requires */
const deployInfo = require('../scripts/getDeployInfo.js')();

console.log(
  `Deploying editBranch "${deployInfo.branch}" and deployPath "${deployInfo.deployPath}" deployName "${deployInfo.deployName}"`
);

let baseUrl = '/mongodb-memory-server/' + deployInfo.deployPath;

if (!baseUrl.endsWith('/')) {
  baseUrl += '/';
}

module.exports = {
  title: 'mongodb-memory-server',
  tagline:
    'Spinning up mongod in memory for fast tests. If you run tests in parallel this lib helps to spin up dedicated mongodb servers for every test file in MacOS, *nix, Windows or CI environments (in most cases with zero-config).',
  url: 'https://typegoose.github.io',
  baseUrl: baseUrl,
  favicon: 'img/favicon.ico',
  organizationName: 'typegoose',
  projectName: 'mongodb-memory-server',
  themeConfig: {
    algolia: {
      apiKey: '8fe2db2c68a589011ca177c3f6098a76',
      appId: '3KTVP2YGJO',
      indexName: 'docusaurus',
      contextualSearch: false, // since docusaurus v2.beta-15, it is defaulted to "true", but somehow breaks current search
      searchParameters: {
        facetFilters: [`version:${deployInfo.searchName}`],
      },
    },
    navbar: {
      title: 'mongodb-memory-server',
      // logo: {
      //   alt: 'Logo',
      //   src: 'img/logo.svg',
      // },
      items: [
        {
          type: 'custom-beta-notice',
          position: 'left',
        },
        {
          // cannot use "docsVersionDropdown" because we are not using docusaurus' versioning system
          type: 'custom-versions-selector',
          position: 'right',
          label: deployInfo.deployName,
        },
        {
          to: 'docs/guides/quick-start-guide',
          activeBasePath: 'guides',
          label: 'Guides',
          position: 'right',
        },
        {
          to: 'docs/api/index-api',
          activeBasePath: 'api',
          label: 'API',
          position: 'right',
        },
        {
          // triple "/", to always be relative to the base-url and not the current url
          to: 'pathname:///typedoc/index.html',
          label: 'Typedoc',
          position: 'right',
          // overwrite default target of "_blank"(new tab)
          target: '_self',
        },
        {
          href: 'https://github.com/typegoose/mongodb-memory-server/blob/master/CHANGELOG.md',
          label: 'Changelog',
          position: 'right',
        },
        {
          href: 'https://github.com/typegoose/mongodb-memory-server',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/mongodb-memory-server',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/bgCrRP9',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/typegoose/mongodb-memory-server',
            },
          ],
        },
      ],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/typegoose/mongodb-memory-server/edit/master/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  customFields: {
    deployInfo: deployInfo,
  },
};
