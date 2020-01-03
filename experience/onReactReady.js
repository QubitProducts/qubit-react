var Promise = require('sync-p')

var getReact = require('../lib/namespace').getReact
var log = require('./createLogger')('onReactReady')

module.exports = function onReactReady () {
  return new Promise(function (resolve) {
    var ns = getReact()
    if (ns.React) {
      log.debug('React available, running callback')
      resolve(ns.React)
      return
    }

    log.debug('React unavailable, pushing into onReactReady array')
    ns.onReactReady = ns.onReactReady || []
    ns.onReactReady.push(resolve)
  })
}
