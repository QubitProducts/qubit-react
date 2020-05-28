var _ = require('slapdash')
var all = require('sync-p/all')

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
      boom('Aborting due to error with versions')
    }

    var released = false
    var wrappers = _.reduce(ids, function (memo, id) {
      memo[id] = getWrapper(owner, id)
      return memo
    }, {})

    var registrations = _.map(_.keys(wrappers), function (key) {
      log.debug('Registering ' + key)
      return wrappers[key].register()
    })

    all(registrations)
      .then(onReactReady)
      .then(function (React) {
        // This setTimeout is to ensure that we store the release function of the
        // registration in index.js _before_ we store the render function.
        setTimeout(() => {
          cb({
            render: render,
            release: release
          }, React)
        }, 0)
      })

    return release

    function render (id, fn) {
      if (released) return
      var wrapper = wrappers[id]

      if (!wrapper) {
        boom('Cannot render into slot "' + id + '", it has not been registered')
      }
      if (!wrapper.canClaim()) {
        boom('Cannot render into slot "' + id + '", it is already claimed by experience ' + wrapper.getOwner())
      }
      wrapper.render(fn)
    }

    function release (toRelease) {
      if (released) return
      _.each(_.keys(wrappers), function (key) {
        wrappers[key].release()
      })
      released = true
    }

    function boom (msg) {
      log.error(msg)
      throw new Error(msg)
    }
  }
}
