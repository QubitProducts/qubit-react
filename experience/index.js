var Promise = require('sync-p')
var createRegister = require('./createRegister')

module.exports = function (meta) {
  var owner = meta && (meta.owner || meta.experimentId)
  if (!owner) {
    throw new Error('No owner specified')
  }

  var register = createRegister(owner)
  var release = null
  var render = null
  var React = null

  return {
    getReact: function () {
      if (!React) {
        throw new Error('React not available, you probably forgot to call `options.react.register()`')
      }
      return React
    },
    render: function (id, fn) {
      if (!render) {
        throw new Error('No slots available to render, you probably forgot to call `options.react.register()`')
      }
      render(id, fn)
    },
    release: function () {
      if (release) {
        release()
      }
    },
    register: function (ids, cb) {
      if (release) {
        throw new Error('Register should only be called once per experience')
      }

      if (cb) {
        release = register(ids, cb)
        return release
      } else {
        return new Promise(function (resolve) {
          release = register(ids, function (slots, _React) {
            render = slots.render
            React = _React
            resolve()
          })
        })
      }
    }
  }
}
