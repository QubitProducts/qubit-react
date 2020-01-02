import getWrapper from '../getWrapper'

const registrar = '47147'
const registrar2 = '74174'
const componentId = 'foo'
const noop = () => {}

describe('getWrapper', () => {
  let wrapper
  beforeEach(() => {
    wrapper = getWrapper(registrar, componentId)
  })
  afterEach(() => {
    wrapper = undefined
    window.__qubit = undefined
  })

  describe('register', () => {
    it('sets the render function', () => {
      expect(ns().renderFunction).toBeUndefined()
      wrapper.register()
      expect(ns().renderFunction).not.toBeUndefined()
    })
    it('doesn\'t overwrite the render function if it already exists', () => {
      wrapper.register()
      const fn = ns().renderFunction
      getWrapper(registrar2, componentId).register()
      expect(ns().renderFunction).toBe(fn)
    })
    it('resolves once the render function is called', async () => {
      const cb = jest.fn()
      wrapper.register().then(cb)
      expect(cb).not.toHaveBeenCalled()
      ns().renderFunction({})
      expect(cb).toHaveBeenCalled()
    })
    it('uses props.children when there is no owner render function', () => {
      wrapper.register()
      const result = ns().renderFunction({
        children: 'foo'
      }, null)
      expect(result).toBe('foo')
    })
    it('uses the owner render function when it is available', () => {
      const fn = jest.fn(() => 'bar')
      const props = { children: 'foo' }
      wrapper.register()
      wrapper.render(fn)
      const result = ns().renderFunction(props, 'REACT')
      expect(result).toBe('bar')
      expect(fn).toHaveBeenCalledWith(props, 'REACT')
    })
    it('calls the update function', () => {
      const forceUpdate = jest.fn()
      ns().instances = [{ forceUpdate }]
      wrapper.register()
      ns().renderFunction({})
      expect(forceUpdate).toHaveBeenCalled()
    })
  })

  describe('canClaim', () => {
    it('returns true if nobody has claimed it', () => {
      expect(wrapper.canClaim()).toEqual(true)
    })
    it('returns true if we have already claimed it', () => {
      ns().owner = registrar
      expect(wrapper.canClaim()).toEqual(true)
    })
    it('returns false if someone else has claimed it', () => {
      ns().owner = registrar2
      expect(wrapper.canClaim()).toEqual(false)
    })
  })

  describe('release', () => {
    describe('if not claimed by the instance', () => {
      beforeEach(() => {
        getWrapper(registrar2, componentId).render(() => null)
      })
      it('does not release the wrapper', () => {
        wrapper.release()
        expect(ns().owner).not.toEqual(false)
      })
      it('does not remove the render function', () => {
        ns().ownerRenderFunction = noop
        wrapper.release()
        expect(ns().ownerRenderFunction).not.toBeUndefined()
      })
      it('does not call the update funtions', () => {
        const forceUpdate = jest.fn()
        ns().instances = [{ forceUpdate }]
        wrapper.release()
        expect(forceUpdate).not.toHaveBeenCalled()
      })
    })
    describe('if claimed by the instance', () => {
      beforeEach(() => {
        wrapper.render(() => null)
      })
      it('releases the wrapper', () => {
        wrapper.release()
        expect(ns().owner).toBeUndefined()
      })
      it('removes the owner render function', () => {
        ns().ownerRenderFunction = noop
        wrapper.release()
        expect(ns().ownerRenderFunction).toBeUndefined()
      })
      it('calls the update functions', () => {
        const forceUpdate = jest.fn()
        ns().instances = [{ forceUpdate }]
        wrapper.release()
        expect(forceUpdate).toHaveBeenCalled()
      })
    })
  })

  describe('render', () => {
    it('sets the owner and render function', () => {
      wrapper.render(noop)
      expect(ns().owner).toBe(registrar)
      expect(ns().ownerRenderFunction).toBe(noop)
    })
    it('calls update', () => {
      const forceUpdate = jest.fn()
      ns().instances = [{ forceUpdate }]
      wrapper.render(noop)
      expect(forceUpdate).toHaveBeenCalled()
    })
  })
})

function ns () {
  return window.__qubit.react.components[componentId]
}
