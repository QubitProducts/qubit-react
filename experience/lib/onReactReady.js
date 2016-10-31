var getReactTools = require('./namespace').getReactTools

module.exports = function onReactReady (cb) {
  var reactTools = getReactTools()
  if (reactTools.React) {
    cb(reactTools.React)
    return
  }
  reactTools.onReactReady = reactTools.onReactReady || []
  reactTools.onReactReady.push(cb)
}
