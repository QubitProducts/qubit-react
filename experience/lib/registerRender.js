var getComponent = require('./namespace').getComponent
var updateComponent = require('./updateComponent')
var createLogger = require('./createLogger')('registerRender')

module.exports = function registerRender (id, renderFunction) {
  var log = createLogger(id)
  var ns = getComponent(id)
  if (ns.renderFunction) {
    var message = 'A renderFunction for ' + id + ' has already been registered'
    log.error(message)
    throw new Error(message)
  }

  log.debug('Attaching render function')
  ns.renderFunction = renderFunction

  log.debug('Forcing components to rerender')
  updateComponent(id)

  return {
    dispose: function dispose () {
      log.debug('Removing render function')
      delete ns.renderFunction

      log.debug('Forcing components to rerender')
      updateComponent(id)
    }
  }
}
