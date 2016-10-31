const React = require('react')
const isElementOfType = require('react-addons-test-utils').isElementOfType

const registerComponent = require('../lib/registerComponent')

const componentId = 'foo'
const FooComponent = React.createClass({
  render: function () {}
})

describe('registerComponent', function () {
  afterEach(() => {
    window.__qubit = undefined
  })
  it('should register a render function that renders the component', () => {
    registerComponent(componentId, FooComponent)
    const result = window.__qubit.reactHooks[componentId].handler({}, React)
    expect(isElementOfType(result, FooComponent)).toEqual(true)
  })
  it('should register a render function that renders the component with the correct props', () => {
    const props = {
      prop1: 'prop1',
      prop2: 'prop2'
    }
    registerComponent(componentId, FooComponent)
    const result = window.__qubit.reactHooks[componentId].handler(props, React)
    expect(result.props).toEqual(props)
  })
  it('should return a dispose function', () => {
    const api = registerComponent(componentId, FooComponent)
    expect(api.dispose).toBeDefined()
  })
})
