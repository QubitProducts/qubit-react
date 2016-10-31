'use strict'

const fs = require('fs')
const path = require('path')
const packageJson = require('../package.json')

const targetFile = path.resolve(__dirname, '../wrapper/lib/exposeVersion.js')

let code = fs.readFileSync(targetFile, {
  encoding: 'utf8'
})
code = code.replace(/var\sversion\s=\s'.*'/, `var version = '${packageJson.version}'`)

fs.writeFileSync(targetFile, code)
