var createObjectPath = require('./createObjectPath')
var version = '1.0.2'

module.exports = function exposeVersion () {
  var ns = createObjectPath(window, '__qubit.react')
  ns.version = version
}
