const registerRender = require('../lib/registerRender')

function noop () {}

const componentId = 'foo'

describe('registerRender', () => {
  describe('when components have not yet been rendered', () => {
    it('should register the handler successfully', () => {
      const handler = jest.fn()
      registerRender(componentId, handler)
      expect(window.__qubit.reactHooks[componentId].handler).toBe(handler)
    })
    it('should return a dispose function', () => {
      const api = registerRender(componentId, noop)
      expect(api.dispose).toBeDefined()
    })
    it('dispose function should remove handler', () => {
      const api = registerRender(componentId, noop)
      api.dispose()
      expect(window.__qubit.reactHooks[componentId].handler).toBeUndefined()
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
        reactHooks: {
          [componentId]: {
            update: [forceUpdate]
          }
        }
      }
    })
    it('should register the handler successfully', () => {
      const handler = jest.fn()
      registerRender(componentId, handler)
      expect(window.__qubit.reactHooks[componentId].handler).toBe(handler)
    })
    it('should call the update functions', () => {
      registerRender(componentId, noop)
      expect(forceUpdate).toHaveBeenCalled()
    })
    it('should throw if a handler has already been registered', () => {
      registerRender(componentId, noop)
      expect(() => {
        registerRender(componentId, noop)
      }).toThrow()
    })
    it('should return a dispose function', () => {
      const api = registerRender(componentId, noop)
      expect(api.dispose).toBeDefined()
    })
    describe('the dispose function', () => {
      it('should remove handler', () => {
        const api = registerRender(componentId, noop)
        api.dispose()
        expect(window.__qubit.reactHooks[componentId].handler).toBeUndefined()
      })
      it('should call the update functions', () => {
        const api = registerRender(componentId, noop)
        api.dispose()
        expect(forceUpdate).toHaveBeenCalled()
      })
    })
  })
})
