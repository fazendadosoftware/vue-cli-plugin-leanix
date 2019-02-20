const LeanixReporting = require('./commands/LeanixReporting')
const { error, done, openBrowser, exit } = require('@vue/cli-shared-utils')

module.exports = (api, options) => {

  api.configureWebpack(config => {
    config.devServer = { ...config.devServer, headers: { 'Access-Control-Allow-Origin': '*' } }
  })

  api.chainWebpack(webpackConfig => {
    webpackConfig.devServer.https(true).disableHostCheck(true).host('localhost')
    webpackConfig.plugin('provide').use(require('webpack').ProvidePlugin, [
      {
        $: 'jquery',
        jquery: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        _: 'lodash'
      }
    ])

  })

  api.registerCommand(
    'upload',
    {
      description: 'Builds and uploads the current project to LeanIX',
      usage: 'vue-cli-service upload'
    },
    () => {
      console.log(`👋  Uploading project`)
      const leanixReporting = new LeanixReporting()
      leanixReporting.executeUpload()
        .catch(err => {
          error(`💥  ${err}`)
          exit(-1)
        })
    }
  )

  const { serve } = api.service.commands

  const serveFn = serve.fn

  serve.fn = (...args) => {
    return serveFn(...args).then(res => {
      const { url } = res
      const leanixReporting = new LeanixReporting()
      leanixReporting.login(url).then(launchUrl => {
        done(`your dev report enviroment is accessible at ${launchUrl}`)
        openBrowser(launchUrl)
      })
      .catch(err => {
        error(`💥  ${err}`)
        exit(-1)
      })
    })
  }
}
