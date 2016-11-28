var _ = require('slapdash')

var namespace = require('../lib/namespace')

module.exports = function getWrapper (registrar, id) {
  var ns = namespace.getComponent(id)

  return {
    isClaimed: function isUnclaimed () {
      return !!ns.owner
    },
    claim: function () {
      if (!ns.owner) {
        ns.owner = registrar
      }
    },
    release: checkYerPrivilege(function () {
      ns.renderFunction = undefined
      update()
      ns.owner = undefined
    }),
    render: checkYerPrivilege(function (fn) {
      ns.renderFunction = fn
      update()
    })
  }

  function checkYerPrivilege (fn) {
    return function () {
      if (ns.owner === registrar) {
        fn.apply(fn, arguments)
        return true
      }
      return false
    }
  }

  function update () {
    if (_.isArray(ns.instances)) {
      _.each(ns.instances, function (i) { i.forceUpdate() })
    }
  }
}
