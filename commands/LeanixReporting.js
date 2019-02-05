const fs = require('fs')
const path = require('path')
const rp = require('request-promise')
const jwtDecode = require('jwt-decode')
const { info, done, warn, error, chalk } = require('@vue/cli-shared-utils')

class LeanixReporting {
  constructor () {
    if (fs.existsSync(path.resolve(process.cwd(), 'lxr.json'))) {
    } else {
      const errorMsg = `Could not find lxr.json`
      error(errorMsg)
      throw errorMsg
    }
    this.lxrConfig = require(path.resolve(process.cwd(), 'lxr.json'))
    this.validateLxrConfig()
  }

  get launchUrl () {
    return this._launchUrl
  }

  login (localHostUrl = 'https://localhost:8080') {
    return this.getAccessToken(this.lxrConfig.host, this.lxrConfig.apiToken)
      .then(token => this.getLaunchUrl(localHostUrl, this.lxrConfig.host, token))
      .then(launchURL => {
        this._launchURL = launchURL
        return launchURL
      })
  }

  validateLxrConfig (lxrConfig = this.lxrConfig) {
    if (!lxrConfig) lxrConfig = this.lxrConfig
    const validationErrors = []
    if (!lxrConfig.host) validationErrors.push('host not defined')
    if (!lxrConfig.apiToken) validationErrors.push('apiToken not defined')
    if (validationErrors.length != 0) {
      validationErrors.forEach(err =>
        error(`💥  lxr.json -> ${err}`)
      )
      throw Error('invalid lxr.json file')
    }
  }

  getAccessToken (host, apiToken) {
    const uri = `https://${host}/services/mtm/v1/oauth2/token?grant_type=client_credentials`
    return rp({
      method: 'POST',
      uri,
      headers: {
        Authorization:
          'Basic ' + Buffer.from('apitoken:' + apiToken).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(JSON.parse)
      .then(({ access_token }) => access_token)
  }

  getLaunchUrl (localHostUrl, leanixInstance, bearerToken) {
    return new Promise((resolve, reject) => {
      if (!localHostUrl || typeof leanixInstance !== 'string') {
        const errorMsg = 'no local server url was provided!'
        reject(errorMsg)
      }
      if (!leanixInstance || typeof leanixInstance !== 'string') {
        const errorMsg = 'no leanix instance was provided!'
        throw(Error(errorMsg))
      }
      if (!bearerToken || typeof bearerToken !== 'string') {
        const errorMsg = 'no valid Bearer Token was provided!'
        reject(errorMsg)
      }
  
      const decodedToken = jwtDecode(bearerToken)
      let workspaceName = ''
      if (
        decodedToken &&
        decodedToken.principal &&
        decodedToken.principal.permission &&
        decodedToken.principal.permission.workspaceName
      ) {
        workspaceName = decodedToken.principal.permission.workspaceName
        info(`your workspace is ${chalk.bold(chalk.green(workspaceName))}\n`)
      } else {
        const errorMsg = `could not retrieve workspace name from bearer token!`
        reject(errorMsg)
      }
  
      const urlEncoded = encodeURIComponent(localHostUrl)
      const host = 'https://' + leanixInstance
      const bearerTokenHash = bearerToken ? `#access_token=${bearerToken}` : ''
      const baseLaunchUrl = `${host}/${workspaceName}/reporting/dev?url=${urlEncoded}`
      const launchUrl = baseLaunchUrl + bearerTokenHash
      resolve(launchUrl)
    })
  }
}

module.exports = LeanixReporting
