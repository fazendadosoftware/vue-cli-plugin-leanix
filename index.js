const LeanixReporting = require('./commands/LeanixReporting')
const { info, done, openBrowser } = require('@vue/cli-shared-utils')

module.exports = (api, options) => {
  // https://github.com/vuejs/vue-cli/issues/1647
  // https://stackoverflow.com/questions/49626085/vue-cli-version-3-beta-webpack-configuration

  api.configureWebpack(config => {
    config.devServer = { ...config.devServer, disableHostCheck: true, headers: { 'Access-Control-Allow-Origin': '*' } }
  })
  api.chainWebpack(webpackConfig => {
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
    })
  }
}
