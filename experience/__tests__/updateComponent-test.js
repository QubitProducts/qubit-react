const updateComponent = require('../lib/updateComponent')

const componentId = 'foo'

describe('updateComponent', () => {
  var updateFns
  beforeEach(() => {
    updateFns = [
      jest.fn(),
      jest.fn(),
      jest.fn()
    ]
    window.__qubit = {
      reactHooks: {
        [componentId]: {
          update: updateFns
        }
      }
    }
  })
  afterEach(() => {
    window.__qubit = undefined
  })

  it('calls all the update functions', () => {
    updateComponent(componentId)
    updateFns.forEach((fn) => expect(fn).toHaveBeenCalled())
  })
})
