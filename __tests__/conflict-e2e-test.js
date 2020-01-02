import { mount } from 'enzyme'

import experience from '../experience'

it('conflict', async () => {
  const React = require('react')
  const QubitReactWrapper = require('../wrapper')
  mount(
    <QubitReactWrapper id='wrapper'>
      <div className='wrapped' />
    </QubitReactWrapper>
  )

  // claim a wrapper
  const instance1 = experience({ owner: 'foo' })
  await instance1.register(['wrapper'])

  const instance2 = experience({ owner: 'bar' })
  await instance2.register(['wrapper'])

  instance1.render('wrapper', () => null)
  expect(() => {
    instance2.render('wrapper', () => null)
  }).toThrow(/it is already claimed/)
})
