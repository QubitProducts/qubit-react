var getComponentHook = require('./namespace').getComponentHook
var updateComponent = require('./updateComponent')

module.exports = function registerRender (id, handler) {
  var componentHook = getComponentHook(id)
  if (componentHook.handler) {
    throw new Error('A handler for ' + id + ' has already been registered')
  }
  componentHook.handler = handler
  updateComponent(id)

  return {
    dispose: function dispose () {
      delete componentHook.handler
      updateComponent(id)
    }
  }
}
