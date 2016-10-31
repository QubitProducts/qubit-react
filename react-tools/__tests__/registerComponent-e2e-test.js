import { mount } from 'enzyme'

import reactTools from '../react-tools'

it('registerComponent - e2e', () => {
  const React = require('react')
  class Replacement extends React.Component {
    render () {
      return <div className='replaced' />
    }
  }

  // Attach component before initial render
  const registered = reactTools.registerComponent('wrapper', Replacement)

  // Render it
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
  reactTools.registerComponent('wrapper', Replacement)
  expect(mounted.find('.wrapped').length).toEqual(0)
  expect(mounted.find('.replaced').length).toEqual(1)
})
