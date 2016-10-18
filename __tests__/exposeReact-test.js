import exposeReact from '../lib/exposeReact'

it('exposes React to the correct location', () => {
  const fakeReact = {}
  exposeReact(fakeReact)
  expect(window.__qubit.reactTools.React).toBe(fakeReact)
})

it('runs onReactReady handlers', () => {
  const onReactReady = [jest.fn(), jest.fn()]
  window.__qubit = {
    reactTools: {
      onReactReady: onReactReady
    }
  }
  exposeReact({})
  onReactReady.forEach(fn => expect(fn).toHaveBeenCalled())
})

it('runs onReactReady handlers with React', () => {
  const fakeReact = {}
  // Not using .toHaveBeenCalledWith because we need === match
  const onReactReady = jest.fn(React => expect(React).toBe(fakeReact))
  window.__qubit = {
    reactTools: {
      onReactReady: [onReactReady]
    }
  }
  exposeReact(fakeReact)
})
