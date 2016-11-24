var _ = require('slapdash')

var namespace = require('../lib/namespace')
var log = require('./createLogger')('onReactReady')

module.exports = function exposeReact (React, ReactDOM) {
  var ns = namespace.getReact()
  if (!ns.React || !ns.ReactDOM) {
    ns.React = React
    ns.ReactDOM = ReactDOM

    var onReactReady = ns.onReactReady
    if (onReactReady && _.isArray(onReactReady)) {
      _.each(onReactReady, function (cb) {
        try {
          cb(React, ReactDOM)
        } catch (e) {
          log.error(e)
        }
      })
      ns.onReactReady = []
    }
  }
}
