const fs = require('fs')
const path = require('path')
const rp = require('request-promise')
const jwtDecode = require('jwt-decode')
const { info, done, warn, chalk } = require('@vue/cli-shared-utils')

class LeanixReporting {
  constructor () {
    if (fs.existsSync(path.resolve(process.cwd(), 'lxr.json'))) {
    } else {
      const errorMsg = `Could not find lxr.json`
      error(errorMsg)
      // console.log(chalk.bold(chalk.red(`💥  ${errorMsg}`)))
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
      .catch(err => {
        error(err)
        // console.log(chalk.bold(chalk.red(`💥  ${err}`)))
        throw(err)
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
        // console.log(chalk.bold(chalk.red(`💥  lxr.json -> ${err}`)))
      )
      throw 'Errors found while validating lxr.json file!'
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
      .then(({ access_token }) => {
        return access_token
      })
      .catch(err => {
        error(`💥  ${err}`)
        throw (err)
        // console.log(chalk.bold(chalk.red(`💥  ${err}`)))
      })

    /*
        if (res.statusCode != 200) {
          const errorMsg = `${res.statusCode} while getting the LeanIX API token`
          console.error(chalk.redBright(errorMsg))
          return Promise.reject(errorMsg)
        }
        let body = JSON.parse(res.getBody())
        console.log('body', body)
        if (!body.access_token) {
          const errorMsg = `could not find access_token in response: ${res.getBody()}`
          console.error(chalk.redBright(errorMsg))
          throw errorMsg
        }
        return body.access_token
        */
  }

  getLaunchUrl (localHostUrl, leanixInstance, bearerToken) {
    if (!localHostUrl || typeof leanixInstance !== 'string') {
      const errorMsg = 'no local server url was provided!'
      error(`💥  ${errorMsg}`)
      // console.log(chalk.bold(chalk.red(`💥  ${errorMsg}`)))
      throw errorMsg
    }
    if (!leanixInstance || typeof leanixInstance !== 'string') {
      const errorMsg = 'no leanix instance was provided!'
      error(`💥  ${errorMsg}`)
      // console.log(chalk.bold(chalk.red(`💥  ${errorMsg}`)))
      throw errorMsg
    }
    if (!bearerToken || typeof bearerToken !== 'string') {
      const errorMsg = 'no valid Bearer Token was provided!'
      error(`💥  ${errorMsg}`)
      // console.log(chalk.bold(chalk.red(`💥  ${errorMsg}`)))
      throw errorMsg
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
      error(`💥  ${errorMsg}`)
      // console.log(chalk.bold(chalk.red(`💥  ${errorMsg}`)))
      throw errorMsg
    }

    // const localhostUrl = `https://localhost:${port}`
    const urlEncoded = encodeURIComponent(localHostUrl)
    const host = 'https://' + leanixInstance
    const bearerTokenHash = bearerToken ? `#access_token=${bearerToken}` : ''
    const baseLaunchUrl = `${host}/${workspaceName}/reporting/dev?url=${urlEncoded}`
    const launchUrl = baseLaunchUrl + bearerTokenHash
    return launchUrl
  }
}

module.exports = LeanixReporting
