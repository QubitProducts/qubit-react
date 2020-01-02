var _ = require('slapdash')
var Promise = require('sync-p')

var namespace = require('../lib/namespace')

module.exports = function getWrapper (registrar, id) {
  var ns = namespace.getComponent(id)

  return {
    canClaim: function canClaim () {
      return !ns.owner || ns.owner === registrar
    },
    register: function register () {
      if (!ns.renderFunction) {
        ns.renderFunction = createRenderFunction(ns)
      }
      return new Promise(function (resolve) {
        ns.renderFunction.onMount(resolve)
        update()
      })
    },
    release: function release () {
      if (ns.owner === registrar) {
        ns.ownerRenderFunction = null
        update()
        ns.owner = undefined
      }
    },
    render: function render (fn) {
      ns.owner = registrar
      ns.ownerRenderFunction = fn
      update()
    }
  }

  function update () {
    if (_.isArray(ns.instances)) {
      _.each(ns.instances, function (i) {
        i.forceUpdate()
      })
    }
  }
}

function createRenderFunction (ns) {
  var mounted = false
  var onMount = []

  function render (props, React) {
    if (!mounted) {
      mounted = true
      _.each(onMount, function (cb) {
        cb()
      })
    }

    if (ns.ownerRenderFunction) {
      return ns.ownerRenderFunction(props, React)
    }
    return props.children
  }

  render.onMount = function (cb) {
    if (mounted) {
      cb()
    } else {
      onMount.push(cb)
    }
  }

  return render
}
