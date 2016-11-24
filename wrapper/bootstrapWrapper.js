var log = require('driftwood')('devtools')

var namespace = require('../lib/namespace')
var callDevtoolsHook = require('./callDevtoolsHook')

module.exports = function bootstrapWrapper (id) {
  var component = namespace.getComponent(id)
  if (component.devtoolsBootstrapped) {
    log.debug(id + ' already bootstrapped, skipping')
    return
  }
  log.info('setting up ' + id)

  setupProperty(component, 'renderFunction')
  setupProperty(component, 'claimedBy')
}

function setupProperty (component, propertyName) {
  var backup = component[propertyName]
  Object.defineProperty(component, propertyName, {
    set: function (value) {
      log.debug('detected change for ' + propertyName)
      this['_' + propertyName] = value
      callDevtoolsHook()
    },
    get: function () {
      return this['_' + propertyName]
    }
  })
  if (backup) {
    component[propertyName] = backup
  }
  component.devtoolsBootstrapped = true
}
