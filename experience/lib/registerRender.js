var getComponent = require('./namespace').getComponent
var updateComponent = require('./updateComponent')

module.exports = function registerRender (id, renderFunction) {
  var ns = getComponent(id)
  if (ns.renderFunction) {
    throw new Error('A renderFunction for ' + id + ' has already been registered')
  }
  ns.renderFunction = renderFunction
  updateComponent(id)

  return {
    dispose: function dispose () {
      delete ns.renderFunction
      updateComponent(id)
    }
  }
}
