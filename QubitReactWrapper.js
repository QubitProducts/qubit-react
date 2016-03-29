var React = require('react')

var QubitReactWrapper = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    children: React.PropTypes.node
  },

  getNamespace: function () {
    var id = this.props.id
    window.__qubit = window.__qubit || {}
    window.__qubit.reactHooks = window.__qubit.reactHooks || {}
    window.__qubit.reactHooks[id] = window.__qubit.reactHooks[id] || {}
    return window.__qubit.reactHooks[id]
  },

  componentWillMount: function () {
    var ns = this.getNamespace()
    ns.update = ns.update || []
    ns.update.push(this.forceUpdate)
  },

  componentWillUnmount: function () {
    var self = this
    var ns = this.getNamespace()
    ns.update = ns.update.filter(function (fn) {
      return fn !== self.forceUpdate
    })
  },

  render: function () {
    var handler = this.getHandler(this.props.id)
    if (handler) {
      var result = handler(this.props)
      if (typeof result === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: result }} />
      } else {
        return result
      }
    } else {
      return this.props.children || null
    }
  },

  getHandler: function () {
    return this.getNamespace().handler
  }
})

module.exports = QubitReactWrapper
