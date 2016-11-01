import { mount } from 'enzyme'

import experience from '../experience'

it('register - e2e', () => {
  // Attach render function before initial render
  const registered = experience.register('wrapper', (props, React) => {
    return <div className='replaced' />
  })

  // Render it
  const React = require('react')
  const QubitReactWrapper = require('../wrapper')
  const mounted = mount(
    <QubitReactWrapper id='wrapper'>
      <div className='wrapped' />
    </QubitReactWrapper>
  )

  expect(mounted.find('.wrapped').length).toEqual(0)
  expect(mounted.find('.replaced').length).toEqual(1)

  // Registering another should throw
  expect(() => {
    experience.register('wrapper', (props, React) => {
      return <div className='anotherThing' />
    })
  }).toThrow()

  // Remove it
  registered.dispose()
  expect(mounted.find('.wrapped').length).toEqual(1)
  expect(mounted.find('.replaced').length).toEqual(0)

  // register another one after
  experience.register('wrapper', (props, React) => {
    return <div className='replaced' />
  })
  expect(mounted.find('.wrapped').length).toEqual(0)
  expect(mounted.find('.replaced').length).toEqual(1)
})
