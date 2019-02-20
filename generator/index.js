const fs = require('fs')

module.exports = (api, options, rootOptions) => {
  // save lxr.json file
  const { host, apiToken, reportId, reportTitle, addExample } = options
  fs.writeFileSync('lxr.json', JSON.stringify({ host, apiToken }, null, 2) + '\n')

  api.extendPackage({
    scripts: {
      serve: 'vue-cli-service serve',
      upload: 'vue-cli-service build && vue-cli-service upload',
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

  if (addExample) {
    api.extendPackage({
      dependencies: {
        '@handsontable/vue': '^3.1.0',
        handsontable: '^6.2.2',
      }
    })
    api.render('./template', {
      ...options
    })
  }

  const leanIXLines = `\n\n/* global lx */\nVue.prototype.$lx = lx`

  api.onCreateComplete(() => {
    // inject to main.js
    const fs = require('fs')
    const ext = api.hasPlugin('typescript') ? 'ts' : 'js'
    const mainPath = api.resolve(`./src/main.${ext}`)

    // get content
    let contentMain = fs.readFileSync(mainPath, { encoding: 'utf-8' })
    const lines = contentMain.split(/\r?\n/g).reverse()

    // inject import
    const lastImportIndex = lines.findIndex(line => line.match(/^import/))
    lines[lastImportIndex] += leanIXLines

    // modify app
    contentMain = lines.reverse().join('\n')
    fs.writeFileSync(mainPath, contentMain, { encoding: 'utf-8' })
  })
}
