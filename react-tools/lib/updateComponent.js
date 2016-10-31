var _ = require('slapdash')

var getComponentHook = require('./namespace').getComponentHook

module.exports = function updateComponent (id) {
  var updateFns = getComponentHook(id).update
  if (updateFns && _.isArray(updateFns)) {
    _.each(updateFns, function (update) {
      update()
    })
  }
}
