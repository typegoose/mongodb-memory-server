module.exports = {
  title: 'mongodb-memory-server',
  tagline:
    'Spinning up mongod in memory for fast tests. If you run tests in parallel this lib helps to spin up dedicated mongodb servers for every test file in MacOS, *nix, Windows or CI environments (in most cases with zero-config).',
  url: 'https://nodkz.github.io',
  baseUrl: '/mongodb-memory-server/',
  favicon: 'img/favicon.ico',
  organizationName: 'nodkz',
  projectName: 'mongodb-memory-server',
  themeConfig: {
    //algolia: {
    //  apiKey: '',
    //  indexName: 'mongodb-memory-server',
    //  algoliaOptions: {},
    //},
    navbar: {
      title: 'mongodb-memory-server',
      // logo: {
      //   alt: 'Logo',
      //   src: 'img/logo.svg',
      // },
      items: [
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
          href: 'https://github.com/nodkz/mongodb-memory-server',
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
              href: 'https://github.com/nodkz/mongodb-memory-server',
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
          editUrl: 'https://github.com/nodkz/mongodb-memory-server/edit/master/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
