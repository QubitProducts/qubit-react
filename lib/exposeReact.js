var _ = require('slapdash')

var createObjectPath = require('./createObjectPath')

module.exports = function exposeReact (React) {
  var reactTools = createObjectPath(window, '__qubit.reactTools')
  if (!reactTools.React) {
    reactTools.React = React

    var onReactReady = reactTools.onReactReady
    if (onReactReady && _.isArray(onReactReady)) {
      _.each(onReactReady, function (cb) {
        cb(React)
      })
    }
  }
}
