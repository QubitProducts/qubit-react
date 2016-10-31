import exposeVersion from '../lib/exposeVersion'

describe('exposeVersion', () => {
  afterEach(() => {
    window.__qubit = undefined
  })

  it('exposes React to the correct location', () => {
    exposeVersion()
    expect(window.__qubit.reactTools.version).not.toBeUndefined()
  })
})
