import validateVersions from '../validateVersions'

describe('validateVersions', () => {
  it('returns false for invalid wrapper version', () => {
    expect(validateVersions('1.0.0', 'not.a.version')).toBe(false)
  })
  it('returns false for mismatched major versions', () => {
    expect(validateVersions('1.0.0', '2.0.0')).toBe(false)
  })
  it('returns true for mismatched minor versions', () => {
    expect(validateVersions('1.0.0', '1.1.0')).toBe(true)
  })
  it('returns true for mismatched patch versions', () => {
    expect(validateVersions('1.0.0', '1.0.1')).toBe(true)
  })
})
