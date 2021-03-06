const fs = require('fs')
const path = require('path')
const tar = require('tar')
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
    // compatibility workaround for old apiToken notation
    if (this.lxrConfig.apiToken && !this.lxrConfig.apitoken) {
      this.lxrConfig.apitoken = this.lxrConfig.apiToken
    }
    this.validateLxrConfig()
  }

  get launchUrl () {
    return this._launchUrl
  }

  login (localHostUrl = 'https://localhost:8080') {
    console.debug('login -> localHostUrl', localHostUrl)
    return this.getAccessToken(this.lxrConfig.host, this.lxrConfig.apitoken)
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
    if (!lxrConfig.apitoken) validationErrors.push('apitoken not defined')
    if (validationErrors.length != 0) {
      validationErrors.forEach(err =>
        error(`💥  lxr.json -> ${err}`)
      )
      throw Error('invalid lxr.json file')
    }
  }

  getAccessToken (host, apitoken) {
    const uri = `https://${host}/services/mtm/v1/oauth2/token?grant_type=client_credentials`
    return rp({
      method: 'POST',
      uri,
      headers: {
        Authorization: 'Basic ' + Buffer.from('apitoken:' + apitoken).toString('base64'),
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
  
      const urlEncoded = localHostUrl === decodeURIComponent(localHostUrl)
        ? encodeURIComponent(localHostUrl) // localHostUrl is not encoded
        : localHostUrl // localHostUrl is already encoded

      const host = 'https://' + leanixInstance
      const bearerTokenHash = bearerToken ? `#access_token=${bearerToken}` : ''
      const baseLaunchUrl = `${host}/${workspaceName}/reporting/dev?url=${urlEncoded}`
      const launchUrl = baseLaunchUrl + bearerTokenHash
      resolve(launchUrl)
    })
  }

  writeMetadataFile () {
    return new Promise((resolve, reject) => {
      const packageJson = require(path.resolve(process.cwd(), 'package.json'))
      const metadataFile = path.resolve(process.cwd(), 'dist/lxreport.json')
      const metadata = Object.assign({}, {
        name: packageJson.name,
        version: packageJson.version,
        author: packageJson.author,
        description: packageJson.description,
        documentationLink: packageJson.documentationLink
      }, packageJson.leanixReport)
      fs.writeFileSync(metadataFile, JSON.stringify(metadata))
      resolve()
    })
  }

  createTarFromSrcFolderAndAddToDist () {
    const files = fs.readdirSync(path.resolve(process.cwd(), 'src'))
    return tar.c({ gzip: true, cwd: 'src', file: 'dist/src.tgz' }, files)
  }

  createTarFromDistFolder () {
    const files = fs.readdirSync(path.resolve(process.cwd(), 'dist'))
    return tar.c({ gzip: true, cwd: 'dist', file: 'bundle.tgz' }, files)
  }

  executeUpload () {
    let bearerToken
    return this.getAccessToken(this.lxrConfig.host, this.lxrConfig.apitoken)
      .then(token => { bearerToken = token; return this.writeMetadataFile() })
      .then(() => this.createTarFromSrcFolderAndAddToDist())
      .then(() => this.createTarFromDistFolder())
      .then(() => {
        const options = {
          method: 'POST',
          url: `https://${this.lxrConfig.host}/services/pathfinder/v1/reports/upload`,
          headers: {
            'Authorization': 'Bearer ' + bearerToken
          },
          formData: {
            file: fs.createReadStream(path.resolve(process.cwd(), 'bundle.tgz'))
          }
        }
        return rp(options)
      })
      .then(body => {
        const bodyJson = JSON.parse(body)
        if (bodyJson.status === 'OK') {
          info(`project sucessfully uploaded`)
          return true
        } else if (bodyJson.status === 'ERROR') {
          error(`💥  error uploading the project -> ${responseJson.errorMessage}`)
          return false
        }
      })
      .catch(err => {
        const responseBody = err.response ? err.response.toJSON().body : err
        const errorJson = JSON.parse(responseBody)
        if (errorJson.errorMessage) {
          error(`💥  error uploading the project -> ${errorJson.errorMessage}`)
        } else {
          error(`💥  error uploading the project -> ${responseBody}`)
        }
        return false
      })
  }
}

module.exports = LeanixReporting
