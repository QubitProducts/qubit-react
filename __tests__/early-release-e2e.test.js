import { mount } from 'enzyme'

import experience from '../experience'

it('early release', async () => {
  const React = require('react')
  const QubitReactWrapper = require('../wrapper')

  const instance = experience({ owner: 'foo' })
  // register it without the wrapper being mounted yet
  const registrationPromise = instance.register(['wrapper'])
  // immediately release it back (this can happen in experience-engine)
  instance.release()

  // then mount the wrapper
  mount(
    <QubitReactWrapper id='wrapper'>
      <div className='wrapped' />
    </QubitReactWrapper>
  )
  await registrationPromise

  // we should be able to register again because we released it
  await instance.register(['wrapper'])
})
