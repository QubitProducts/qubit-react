var React = require('react')
var createLogger = require('./lib/createLogger')

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
    this.update = this.forceUpdate.bind(this)
    var ns = this.getNamespace()
    ns.update = ns.update || []
    ns.update.push(this.update)
  },

  componentWillUnmount: function () {
    var self = this
    var ns = this.getNamespace()
    ns.update = ns.update.filter(function (fn) {
      return fn !== self.update
    })
  },

  render: function () {
    if (this.getHandler()) {
      try {
        return this.renderWithHandler()
      } catch (e) {
        this.getLogger().error(e)
        return this.props.children || null
      }
    } else {
      return this.props.children || null
    }
  },

  renderWithHandler: function () {
    var handler = this.getHandler()
    var result = handler(this.props)
    if (typeof result === 'string') {
      return React.createElement('div', {
        dangerouslySetInnerHTML: { __html: result }
      })
    } else {
      return result
    }
  },

  getLogger: function () {
    if (!this.logger) {
      this.logger = createLogger(this.props.id)
    }
    return this.logger
  },

  getHandler: function () {
    return this.getNamespace().handler
  }
})

module.exports = QubitReactWrapper
