var React = require('react')

var createObjectPath = require('./lib/createObjectPath')
var createLogger = require('./lib/createLogger')('handler')
require('./lib/exposeReact')(React)
require('./lib/exposeVersion')()

var QubitReactWrapper = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    children: React.PropTypes.node
  },

  getNamespace: function () {
    var id = this.props.id
    return createObjectPath(window, ['__qubit', 'react', 'components', id])
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
    if (this.getNamespace().renderFunction) {
      try {
        return this.renderWithOverride()
      } catch (e) {
        this.getLogger().error(e)
        return this.props.children || null
      }
    } else {
      return this.props.children || null
    }
  },

  renderWithOverride: function () {
    var renderFunction = this.getNamespace().renderFunction
    var result = renderFunction(this.props, React)
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
  }
})

module.exports = QubitReactWrapper
