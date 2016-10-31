const onReactReady = require('../lib/onReactReady')

describe('onReactReady', () => {
  beforeEach(() => {
    window.__qubit = {
      react: {}
    }
  })
  afterEach(() => {
    window.__qubit = undefined
  })

  describe('if react is ready', () => {
    const React = {}
    beforeEach(() => {
      window.__qubit.react.React = React
    })
    afterEach(() => {
      delete window.__qubit.react.React
    })
    it('runs the cb', () => {
      const cb = jest.fn()
      onReactReady(cb)
      expect(cb).toHaveBeenCalled()
    })
    it('calls the cb with React', () => {
      const cb = jest.fn()
      onReactReady(cb)
      expect(cb).toHaveBeenCalledWith(React)
    })
  })

  describe('if react is not ready', () => {
    it('does not run the cb', () => {
      const cb = jest.fn()
      onReactReady(cb)
      expect(cb).not.toHaveBeenCalled()
    })
    it('adds the cb to onReactReady array', () => {
      const cb = jest.fn()
      onReactReady(cb)
      const ns = window.__qubit.react
      expect(ns.onReactReady[0]).toBe(cb)
    })
  })
})
