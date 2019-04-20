module.exports = [
  {
    name: 'reportTitle',
    type: 'string',
    required: true,
    message: 'Report title?',
    default: 'My Custom Report'
  },
  /*
  {
    name: 'description',
    type: 'string',
    required: false,
    message: 'Report description',
    default: 'LeanIX custom report build with Vue.js.'
  },
  */
  {
    name: 'reportId',
    type: 'string',
    required: true,
    message: 'Report id?',
    default: 'net.leanix.report.myCustomReport'
  },
  {
    name: 'host',
    type: 'string',
    required: true,
    message: 'LeanIX instance',
    default: 'app.leanix.net'
  },
  {
    name: 'apitoken',
    type: 'string',
    required: true,
    message: 'LeanIX API Token (see: https://dev.leanix.net/docs/authentication#section-generate-api-tokens)'
  }
  /*
  {
    name: `addExample`,
    type: 'confirm',
    message: 'Install a demo table component for this project?',
    default: false
  }
  */
]
