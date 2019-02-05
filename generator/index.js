const fs = require('fs')

module.exports = (api, options, rootOptions) => {
  // save lxr.json file
  const { host, apiToken } = options
  fs.writeFileSync('lxr.json', JSON.stringify({ host, apiToken }, null, 2) + '\n')

  api.extendPackage({
    scripts: {
      'leanix-serve': 'vue-cli-service leanix-serve'
    },
    dependencies: {
      '@leanix/reporting': '^0.3.1',
      jquery: '^3.3.1',
      lodash: '^4.17.11'
    },
    leanixReporting: {
      id: options.reportId,
      title: options.reportTitle,
      defaultConfig: {}
    }
  })

  api.injectImports(api.entryFile, [`import '@leanix/reporting'`])

  if (options.addExample) {
    api.render('./template', {
      ...options
    })
  }

  const leanIXLines = `

// add lx global object to vue prototype
/* global lx */
Vue.prototype.$lx = lx`

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
