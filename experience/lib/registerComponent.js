var registerRender = require('./registerRender')

module.exports = function registerComponent (id, component) {
  return registerRender(id, function (props, React) {
    return React.createElement(component, props)
  })
}
