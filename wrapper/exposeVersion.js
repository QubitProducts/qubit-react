var namespace = require('../lib/namespace')
var version = require('../lib/libraryVersion')
var log = require('./createLogger')

module.exports = function exposeVersion () {
  var ns = namespace.getReact()
  if (ns.version && ns.version !== version) {
    log.warn('Multiple versions of wrapper in use: ' + ns.version + ', ' + version)
  }
  ns.version = version
}
