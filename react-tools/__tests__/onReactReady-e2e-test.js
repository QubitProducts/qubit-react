import { mount } from 'enzyme'

import reactTools from '../react-tools'

it('onReactReady - e2e', () => {
  // Attach handler before React is exposed
  const preOnReadyHandler = jest.fn()
  reactTools.onReactReady(preOnReadyHandler)

  expect(window.__qubit.reactTools.onReactReady.length).toEqual(1)
  expect(preOnReadyHandler).not.toHaveBeenCalled()

  // Expose it
  const React = require('react')
  const QubitReactWrapper = require('qubit-react-wrapper')
  mount(
    <QubitReactWrapper id='wrapper'>
      <div className='wrapped' />
    </QubitReactWrapper>
  )

  expect(window.__qubit.reactTools.onReactReady.length).toEqual(0)
  expect(preOnReadyHandler).toHaveBeenCalled()

  // Attach one after it's exposed
  const postOnReadyHandler = jest.fn()
  reactTools.onReactReady(postOnReadyHandler)

  expect(window.__qubit.reactTools.onReactReady.length).toEqual(0)
  expect(postOnReadyHandler).toHaveBeenCalled()
})
