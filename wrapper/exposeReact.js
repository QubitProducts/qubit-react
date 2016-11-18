var _ = require('slapdash')

var namespace = require('../lib/namespace')
var log = require('./createLogger')('onReactReady')

module.exports = function exposeReact (React) {
  var ns = namespace.getReact()
  if (!ns.React) {
    ns.React = React

    var onReactReady = ns.onReactReady
    if (onReactReady && _.isArray(onReactReady)) {
      _.each(onReactReady, function (cb) {
        try {
          cb(React)
        } catch (e) {
          log.error(e)
        }
      })
      ns.onReactReady = []
    }
  }
}
