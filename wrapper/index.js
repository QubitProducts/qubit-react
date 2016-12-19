if (typeof window !== 'undefined') {
  module.exports = require('./QubitReactWrapper')
} else {
  // If server side rendering, there will be nothing in the global namespace
  // to override. So we just render the children
  module.exports = function (props) {
    return props.children
  }
}
