var _ = require('slapdash')

var namespace = require('../lib/namespace')

module.exports = function getWrapper (registrar, id) {
  var ns = namespace.getComponent(id)

  return {
    isUnclaimed: function isUnclaimed () {
      return !ns.claimedBy
    },
    claim: function () {
      if (!ns.claimedBy) {
        ns.claimedBy = registrar
      }
    },
    release: checkYerPrivilege(function () {
      ns.renderFunction = undefined
      update()
      ns.claimedBy = false
    }),
    render: checkYerPrivilege(function (fn) {
      ns.renderFunction = fn
      update()
    }),
    unrender: checkYerPrivilege(function () {
      ns.renderFunction = undefined
      update()
    })
  }

  function checkYerPrivilege (fn) {
    return function () {
      if (ns.claimedBy === registrar) {
        fn.apply(fn, arguments)
        return true
      }
      return false
    }
  }

  function update () {
    if (_.isArray(ns.update)) {
      _.each(ns.update, function (u) { u() })
    }
  }
}
