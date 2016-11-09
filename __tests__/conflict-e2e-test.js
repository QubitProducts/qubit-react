import { mount } from 'enzyme'

import experience from '../experience'

it('e2e', () => {
  const React = require('react')
  const QubitReactWrapper = require('../wrapper')
  mount(
    <QubitReactWrapper id='wrapper'>
      <div className='wrapped' />
    </QubitReactWrapper>
  )

  // claim a wrapper
  experience({ owner: 'foo' }).register(['wrapper'], () => {})

  // try claiming the same one
  const cb = jest.fn()
  experience({ owner: 'bar' }).register(['wrapper'], cb)

  expect(cb).not.toHaveBeenCalled()
})
