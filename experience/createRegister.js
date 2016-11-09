var _ = require('slapdash')

var namespace = require('../lib/namespace')
var experienceVersion = require('../lib/libraryVersion')
var validateVersions = require('./validateVersions')
var log = require('./createLogger')
var onReactReady = require('./onReactReady')
var getWrapper = require('./getWrapper')

module.exports = function createRegister (owner) {
  return function register (ids, cb) {
    var wrapperVersion = namespace.getReact().version
    if (!validateVersions(experienceVersion, wrapperVersion)) {
      log.error('Aborting due to error with versions')
      return
    }

    var disposed = false
    var wrappers = _.reduce(ids, function (memo, id) {
      memo[id] = getWrapper(owner, id)
      return memo
    }, {})

    var allAvailable = _.every(_.keys(wrappers), function (key) {
      return !wrappers[key].isClaimed()
    })

    if (allAvailable) {
      _.each(_.keys(wrappers), function (key) {
        wrappers[key].claim()
      })

      onReactReady(function (React) {
        cb({
          render: function (id, fn) {
            if (disposed) return

            if (!wrappers[id]) {
              log(id).warn('Slot not found')
              return
            }
            var success = wrappers[id].render(fn)
            if (!success) {
              log(id).error('Failed to render to ' + id)
            }
          },
          unrender: function (id) {
            if (disposed) return

            if (!wrappers[id]) {
              log(id).warn('Slot not found')
              return
            }
            var success = wrappers[id].unrender()
            if (!success) {
              log(id).error('Failed to unrender ' + id)
            }
          },
          dispose: dispose
        }, React)
      })
    }

    return dispose

    function dispose () {
      _.each(_.keys(wrappers), function (key) {
        wrappers[key].release()
      })
      disposed = true
    }
  }
}
