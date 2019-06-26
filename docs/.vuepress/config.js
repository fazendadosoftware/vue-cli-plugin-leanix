module.exports = {
  base: '/',
  serviceWorker: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue LeanIX plugin',
      description: '📊 Create LeanIX custom reports using Vue! 👌',
    },
    '/pt/': {
      lang: 'pt-BR',
      title: 'Vue LeanIX plugin',
      description: '📊 Crie relatórios customizados da LeanIX usando Vue! 👌',
    }
  },
  themeConfig: {
    repo: 'fazendadosoftware/vue-cli-plugin-leanix',
    docsDir: 'docs',
    editLinks: true,
    serviceWorker: {
      updatePopup: true,
    },
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh"
          }
        },
        // algolia docsearch options for current locale
        algolia: {},
        nav: [
          { text: 'Guide', link: '/guide/' },
          { text: 'leanix-reporting', link: 'https://github.com/leanix/leanix-reporting' }
        ],
        displayAllHeaders: true,
        sidebar: {
          '/guide/': [
            '',
            'getting-started',
            {
              title: 'Advanced',
              collapsable: false,
              children: [
                'configuration'
              ]
            }
          ]
        }
      }
    }
  }
}