module.exports = {
  
  base: '/vue-cli-plugin-leanix/',
  serviceWorker: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue CLI LeanIX plugin',
      description: '📊 Create LeanIX custom reports using Vue! 👌',
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
        sidebarDepth: 2,
        sidebar: {
          '/guide/': [
            '',
            'step-by-step'
            /*
            {
              title: 'Advanced',
              collapsable: false,
              children: [
                'configuration'
              ]
            }
            */
          ]
        }
      }
    }
  }
}