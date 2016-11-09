import {
  isValid,
  getMajor,
  getMinor,
  getPatch
} from '../semver'

describe('semver', () => {
  describe('isValid', () => {
    it('returns true for a valid version', () => {
      expect(isValid('1.2.3')).toBe(true)
    })
    it('returns false for a non numerical major', () => {
      expect(isValid('a.2.3')).toBe(false)
    })
    it('returns false for a non numerical minor', () => {
      expect(isValid('1.a.3')).toBe(false)
    })
    it('returns false for a non numerical patch', () => {
      expect(isValid('1.2.a')).toBe(false)
    })
    it('returns false for an empty major', () => {
      expect(isValid('.2.3')).toBe(false)
    })
    it('returns false for an empty minor', () => {
      expect(isValid('1..3')).toBe(false)
    })
    it('returns false for an empty patch', () => {
      expect(isValid('1.2.')).toBe(false)
    })
    it('returns false for too many dots', () => {
      expect(isValid('1.2.3.4')).toBe(false)
    })
  })
  describe('getMajor', () => {
    it('returns major', () => {
      expect(getMajor('1.2.3')).toBe(1)
    })
  })
  describe('getMinor', () => {
    it('returns minor', () => {
      expect(getMinor('1.2.3')).toBe(2)
    })
  })
  describe('getPatch', () => {
    it('returns patch', () => {
      expect(getPatch('1.2.3')).toBe(3)
    })
  })
})
