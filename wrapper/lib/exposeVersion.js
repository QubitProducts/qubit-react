var createObjectPath = require('./createObjectPath')
var version = '1.0.2'

module.exports = function exposeVersion () {
  var reactTools = createObjectPath(window, '__qubit.reactTools')
  reactTools.version = version
}
