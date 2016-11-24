var createObjectPath = require('./createObjectPath')

function getReact () {
  return createObjectPath(window, '__qubit.react')
}

function getComponent (id) {
  var path = ['__qubit', 'react', 'components', id]
  return createObjectPath(window, path)
}

function getDevtools () {
  return createObjectPath(window, '__qubit.react.devtools')
}

module.exports = {
  getReact: getReact,
  getComponent: getComponent,
  getDevtools: getDevtools
}
