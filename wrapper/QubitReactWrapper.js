var React = require('react')
var ReactDOM = require('react-dom')

var bootstrapWrapper = require('./bootstrapWrapper')
var callDevtoolsHook = require('./callDevtoolsHook')
var getComponent = require('../lib/namespace').getComponent
var createLogger = require('./createLogger')('renderFunction')
require('./exposeReact')(React, ReactDOM)
require('./exposeVersion')()

var QubitReactWrapper = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    children: React.PropTypes.node
  },

  getNamespace: function () {
    return getComponent(this.props.id)
  },

  componentWillMount: function () {
    bootstrapWrapper(this.props.id)
    var ns = this.getNamespace()
    ns.instances = ns.instances || []
    ns.instances.push(this)

    callDevtoolsHook()
  },

  componentDidUpdate: function () {
    callDevtoolsHook()
  },

  componentWillUnmount: function () {
    var self = this
    var ns = this.getNamespace()

    ns.instances = ns.instances.filter(function (instance) {
      return instance !== self
    })

    callDevtoolsHook()
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
