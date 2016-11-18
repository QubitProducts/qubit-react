var getReact = require('../lib/namespace').getReact
var log = require('./createLogger')('onReactReady')

module.exports = function onReactReady (cb) {
  var ns = getReact()
  if (ns.React) {
    log.debug('React available, running callback')
    cb(ns.React)
    return
  }

  log.debug('React unavailable, pushing into onReactReady array')
  ns.onReactReady = ns.onReactReady || []
  ns.onReactReady.push(cb)
}
