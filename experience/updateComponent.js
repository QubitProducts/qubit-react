var _ = require('slapdash')

var getComponent = require('../lib/namespace').getComponent

module.exports = function updateComponent (id) {
  var updateFns = getComponent(id).update
  if (updateFns && _.isArray(updateFns)) {
    _.each(updateFns, function (update) {
      update()
    })
  }
}
