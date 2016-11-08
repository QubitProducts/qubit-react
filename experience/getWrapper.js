var _ = require('slapdash')

var namespace = require('../lib/namespace')

module.exports = function getWrapper (id) {
  var ns = namespace.getComponent(id)
  var uniq = '' + Date.now() + Math.ceil(Math.random() * 1000)

  return {
    isUnclaimed: function isUnclaimed () {
      return !ns.claimedBy
    },
    claim: function () {
      if (!ns.claimedBy) {
        ns.claimedBy = uniq
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
      if (ns.claimedBy === uniq) {
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
