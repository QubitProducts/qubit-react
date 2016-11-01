var namespace = require('../lib/namespace')
var version = '1.0.2'

module.exports = function exposeVersion () {
  var ns = namespace.getReact()
  ns.version = version
}
