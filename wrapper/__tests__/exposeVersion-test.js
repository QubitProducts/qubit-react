import exposeVersion from '../exposeVersion'

describe('exposeVersion', () => {
  afterEach(() => {
    window.__qubit = undefined
  })

  it('exposes React to the correct location', () => {
    exposeVersion()
    expect(window.__qubit.react.version).not.toBeUndefined()
  })
})
