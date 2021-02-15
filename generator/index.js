const fs = require('fs')

module.exports = (api, options, rootOptions) => {
  const { semver, loadModule } = require(require.resolve('@vue/cli-shared-utils'))
  const vue = loadModule('vue', api.resolve('package.json'))
  const isVue3 = vue && semver.major(vue.version) === 3

  // save lxr.json file
  const { host, apitoken, reportId, reportTitle, addExample } = options
  fs.writeFileSync('lxr.json', JSON.stringify({ host, apitoken }, null, 2) + '\n')

  api.extendPackage({
    scripts: {
      serve: 'vue-cli-service serve',
      upload: 'vue-cli-service build && vue-cli-service upload',
    },
    dependencies: {
      '@leanix/reporting': '^0.4.54'
    },
    leanixReport: {
      id: reportId,
      title: reportTitle,
      defaultConfig: {}
    },
    vue: {
      publicPath: '',
      assetsDir: 'static/'
    }
  })

  api.injectImports(api.entryFile, [`import '@leanix/reporting'`])
  api.exitLog('Installed @leanix/reporting')
  api.exitLog('Documentation available at https://github.com/leanix/leanix-reporting')

  // TODO:
  // https://v3.vuejs.org/guide/migration/global-api.html#vue-prototype-replaced-by-config-globalproperties
  

  api.onCreateComplete(() => {
    const fs = require('fs')

    // .gitignore - not included in files on postProcessFiles
    const ignorePath = '.gitignore'
    const ignoreCompletePath = api.resolve(ignorePath)
    const ignore = fs.existsSync(ignoreCompletePath)
      ? fs.readFileSync(ignoreCompletePath, 'utf-8')
      : ''
    const ignoreContent = '\n# LeanIX specific files\nlxr.json\n*.tgz\n\n'
    fs.writeFileSync(ignoreCompletePath, ignore + ignoreContent)
    api.exitLog(`Updated ${ignorePath} : lxr.json and *.tgz were added to ignore list`)

    // inject to main.js
    const ext = api.hasPlugin('typescript') ? 'ts' : 'js'
    const mainPath = api.resolve(`./src/main.${ext}`)

    // get content
    let contentMain = fs.readFileSync(mainPath, { encoding: 'utf-8' })
    const lines = contentMain.split(/\r?\n/g).reverse()
    if (isVue3) {
      const createAppLineIdx = lines.findIndex(line => line.indexOf('createApp') > -1)
      if (createAppLineIdx > -1) {
        lines.splice(createAppLineIdx, 1, 'const app = createApp(App)')
        lines.splice(createAppLineIdx, 0, `/* global lx */\napp.config.globalProperties.$lx = lx\napp.mount(\'#app\')`)
      } else {
        api.exitLog('Add this line to main.js: app.config.globalProperties.$lx = lx')
      }
    } else {
      // inject import
      const lastImportIndex = lines.findIndex(line => line.match(/^import/))
      lines[lastImportIndex] += `\n\n/* global lx */\nVue.prototype.$lx = lx`
    }

    // modify app
    contentMain = lines.reverse().join('\n')
    fs.writeFileSync(mainPath, contentMain, { encoding: 'utf-8' })
  })
}
