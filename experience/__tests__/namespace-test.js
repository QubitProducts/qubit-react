const namespace = require('../lib/namespace')

describe('getReact', () => {
  it('creates react tools namespace', () => {
    namespace.getReact()
    expect(window.__qubit.react).toBeDefined()
  })
})

describe('getComponent', () => {
  it('creates component namespace', () => {
    const componentId = 'foo'
    namespace.getComponent(componentId)
    expect(window.__qubit.react.components[componentId]).toBeDefined()
  })
})
