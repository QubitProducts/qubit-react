var getReact = require('./namespace').getReact

module.exports = function onReactReady (cb) {
  var ns = getReact()
  if (ns.React) {
    cb(ns.React)
    return
  }
  ns.onReactReady = ns.onReactReady || []
  ns.onReactReady.push(cb)
}
