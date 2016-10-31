import { mount } from 'enzyme'

import experience from '../experience'

it('registerRender - e2e', () => {
  // Attach render function before initial render
  const registered = experience.registerRender('wrapper', (props, React) => {
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

  // Remove it
  registered.dispose()
  expect(mounted.find('.wrapped').length).toEqual(1)
  expect(mounted.find('.replaced').length).toEqual(0)

  // register another one after
  experience.registerRender('wrapper', (props, React) => {
    return <div className='replaced' />
  })
  expect(mounted.find('.wrapped').length).toEqual(0)
  expect(mounted.find('.replaced').length).toEqual(1)
})
