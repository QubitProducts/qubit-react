var createObjectPath = require('./createObjectPath')

function getReact () {
  return createObjectPath(window, '__qubit.react')
}

function getComponent (id) {
  var path = ['__qubit', 'react', 'components', id]
  return createObjectPath(window, path)
}

module.exports = {
  getReact: getReact,
  getComponent: getComponent
}
