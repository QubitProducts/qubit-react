import { mount } from 'enzyme'

import reactTools from '../react-tools'

it('registerRender - e2e', () => {
  // Attach render function before initial render
  const registered = reactTools.registerRender('wrapper', (props, React) => {
    return <div className='replaced' />
  })

  // Render it
  const React = require('react')
  const QubitReactWrapper = require('qubit-react-wrapper')
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
  reactTools.registerRender('wrapper', (props, React) => {
    return <div className='replaced' />
  })
  expect(mounted.find('.wrapped').length).toEqual(0)
  expect(mounted.find('.replaced').length).toEqual(1)
})
