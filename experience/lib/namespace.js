var createObjectPath = require('./createObjectPath')

function getReactTools () {
  return createObjectPath(window, '__qubit.reactTools')
}

function getComponentHook (id) {
  var path = ['__qubit', 'reactHooks', id]
  return createObjectPath(window, path)
}

module.exports = {
  getReactTools: getReactTools,
  getComponentHook: getComponentHook
}
