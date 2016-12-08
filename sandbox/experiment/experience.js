export function activation (options, cb) {
  window.initiate = require('../../experience')
  var experience = require('../../experience')(options.meta)
  window.opts = options

  var release = experience.register([
    'header-subtitle-text'
  ], function (slots, React) {
    options.state.set('slots', slots)
    options.state.set('React', React)
    cb()
  })

  return {
    remove: release
  }
}

export function execution (options) {
  var React = options.state.get('React')
  var slots = options.state.get('slots')

  slots.render('header-subtitle-text', function (props) {
    return <span>Great offers somewhere...</span>
  })

  return {
    remove: slots.release
  }
}
