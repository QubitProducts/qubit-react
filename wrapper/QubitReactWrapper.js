var React = require('react')
var ReactDOM = require('react-dom')
var PropTypes = require('prop-types')
var createReactClass = require('create-react-class')

var bootstrapWrapper = require('./bootstrapWrapper')
var callDevtoolsHook = require('./callDevtoolsHook')
var getComponent = require('../lib/namespace').getComponent
var createLogger = require('./createLogger')('renderFunction')
require('./exposeReact')(React, ReactDOM)
require('./exposeVersion')()

var QubitReactWrapper = createReactClass({
  propTypes: {
    id: PropTypes.string.isRequired,
    children: PropTypes.node
  },

  getNamespace: function () {
    return getComponent(this.props.id)
  },

  componentDidMount: function () {
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

    if (ns.instances) {
      ns.instances = ns.instances.filter(function (instance) {
        return instance !== self
      })
    }

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
    if (!React.isValidElement(result)) {
      throw new Error('Render function did not return a valid React element')
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
