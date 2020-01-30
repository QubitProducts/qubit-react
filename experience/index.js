var Promise = require('sync-p')
var _ = require('slapdash')
var createRegister = require('./createRegister')
var log = require('./createLogger')

module.exports = function (meta) {
  var owner = meta && (meta.owner || meta.experimentId)
  if (!owner) {
    throw new Error('No owner specified')
  }

  var hasLoggedDeprecation = false
  var register = createRegister(owner)
  var registrations = {}
  var React = null

  return {
    getReact: function () {
      if (!React) {
        throw new Error('React not available, you have either not called `options.react.register()` or have not waited until it has resolved')
      }
      return React
    },
    render: function (id, fn) {
      var registration = registrations[id]
      if (!registration) {
        throw new Error('The slot with id \'' + id + '\' has not been registered, make sure you are calling `options.react.register()`')
      }
      if (!registration.render) {
        throw new Error('The slot with id \'' + id + '\' is not yet available for rendering, make sure you are waiting until the promise returned from `options.react.register()` resolves')
      }
      registration.render(id, fn)
    },
    release: function (id) {
      if (id) {
        if (registrations[id]) {
          registrations[id].release()
          delete registrations[id]
        }
      } else {
        _.objectEach(registrations, function (registration) {
          registration.release()
        })
        registrations = {}
      }
    },
    register: function (ids, cb) {
      _.each(ids, function (id) {
        if (registrations[id]) {
          throw new Error('You have already registered the slot with id \'' + id + '\' in this experience')
        }
      })

      if (cb) {
        if (!hasLoggedDeprecation) {
          log.warn('You are using the deprecated callback-based registration method in experience ' + owner + '. Go to https://docs.qubit.com to find out how and why to upgrade to the new promise-based approach.')
          hasLoggedDeprecation = true
        }
        var release = register(ids, cb)
        storePerId('release', release)
        return release
      } else {
        return new Promise(function (resolve) {
          release = register(ids, function (slots, _React) {
            storePerId('render', slots.render)
            React = _React
            resolve()
          })
          storePerId('release', release)
        })
      }

      function storePerId (key, value) {
        _.each(ids, function (id) {
          registrations[id] = registrations[id] || {}
          registrations[id][key] = value
        })
      }
    }
  }
}
