var getDevtools = require('../lib/namespace').getDevtools

module.exports = function callDevtoolsHook () {
  var devtools = getDevtools()
  devtools.wrappersUpdated && devtools.wrappersUpdated()
}
