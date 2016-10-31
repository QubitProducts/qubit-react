const namespace = require('../lib/namespace')

describe('getReactTools', () => {
  it('creates react tools namespace', () => {
    namespace.getReactTools()
    expect(window.__qubit.reactTools).toBeDefined()
  })
})

describe('getComponentHook', () => {
  it('creates component namespace', () => {
    const componentId = 'foo'
    namespace.getComponentHook(componentId)
    expect(window.__qubit.reactHooks[componentId]).toBeDefined()
  })
})
