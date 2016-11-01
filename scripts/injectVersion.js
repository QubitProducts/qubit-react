#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const version = require('../package.json').version

const targetFile = path.resolve(__dirname, '../lib/libraryVersion.js')
fs.writeFileSync(targetFile, `module.exports = '${version}'\n`)
