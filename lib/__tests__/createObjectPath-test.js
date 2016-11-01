import createObjectPath from '../createObjectPath'

describe('createObjectPath', () => {
  it('creates the correct object path from a string', () => {
    var root = {}
    createObjectPath(root, 'foo.bar')
    expect(root.foo.bar).toBeDefined()
  })
  it('creates the correct object path from an array', () => {
    var root = {}
    createObjectPath(root, ['foo', 'bar'])
    expect(root.foo.bar).toBeDefined()
  })
})
