const register = require('../register')

function noop () {}

const componentId = 'foo'

describe('register', () => {
  describe('when components have not yet been rendered', () => {
    it('should register the handler successfully', () => {
      const handler = jest.fn()
      register(componentId, handler)
      expect(window.__qubit.react.components[componentId].renderFunction).toBe(handler)
    })
    it('should return a dispose function', () => {
      const api = register(componentId, noop)
      expect(api.dispose).toBeDefined()
    })
    it('dispose function should remove handler', () => {
      const api = register(componentId, noop)
      api.dispose()
      expect(window.__qubit.react.components[componentId].renderFunction).toBeUndefined()
    })
    afterEach(() => {
      window.__qubit = undefined
    })
  })

  describe('when components have been rendered', () => {
    var forceUpdate
    beforeEach(() => {
      forceUpdate = jest.fn()
      window.__qubit = {
        react: {
          components: {
            [componentId]: {
              update: [forceUpdate]
            }
          }
        }
      }
    })
    it('should register the handler successfully', () => {
      const handler = jest.fn()
      register(componentId, handler)
      expect(window.__qubit.react.components[componentId].renderFunction).toBe(handler)
    })
    it('should call the update functions', () => {
      register(componentId, noop)
      expect(forceUpdate).toHaveBeenCalled()
    })
    it('should throw if a handler has already been registered', () => {
      register(componentId, noop)
      expect(() => {
        register(componentId, noop)
      }).toThrow()
    })
    it('should return a dispose function', () => {
      const api = register(componentId, noop)
      expect(api.dispose).toBeDefined()
    })
    describe('the dispose function', () => {
      it('should remove handler', () => {
        const api = register(componentId, noop)
        api.dispose()
        expect(window.__qubit.react.components[componentId].renderFunction).toBeUndefined()
      })
      it('should call the update functions', () => {
        const api = register(componentId, noop)
        api.dispose()
        expect(forceUpdate).toHaveBeenCalled()
      })
    })
  })
})
