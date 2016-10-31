var _ = require('slapdash')

var createObjectPath = require('./createObjectPath')
var logger = require('./createLogger')('onReactReady')

module.exports = function exposeReact (React) {
  var ns = createObjectPath(window, '__qubit.react')
  if (!ns.React) {
    ns.React = React

    var onReactReady = ns.onReactReady
    if (onReactReady && _.isArray(onReactReady)) {
      _.each(onReactReady, function (cb) {
        try {
          cb(React)
        } catch (e) {
          logger.error(e)
        }
      })
      ns.onReactReady = []
    }
  }
}
