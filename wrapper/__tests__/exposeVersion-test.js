import exposeVersion from '../exposeVersion'
import version from '../../lib/libraryVersion'

describe('exposeVersion', () => {
  afterEach(() => {
    window.__qubit = undefined
  })

  it('exposes the version to the correct location', () => {
    exposeVersion()
    expect(window.__qubit.react.version).not.toBeUndefined()
  })

  it('exposes the correct version', () => {
    exposeVersion()
    expect(window.__qubit.react.version).toBe(version)
  })
})
