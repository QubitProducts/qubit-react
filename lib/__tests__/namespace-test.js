import { getComponent, getReact } from '../namespace'

describe('getReact', () => {
  it('creates react tools namespace', () => {
    getReact()
    expect(window.__qubit.react).toBeDefined()
  })
})

describe('getComponent', () => {
  it('creates component namespace', () => {
    const componentId = 'foo'
    getComponent(componentId)
    expect(window.__qubit.react.components[componentId]).toBeDefined()
  })
})
