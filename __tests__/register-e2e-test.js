import { mount } from 'enzyme'

import experience from '../experience'

it('e2e', () => {
  const React = require('react')
  const QubitReactWrapper = require('../wrapper')
  const mounted = mount(
    <QubitReactWrapper id='wrapper'>
      <div className='wrapped' />
    </QubitReactWrapper>
  )

  // claim a wrapper
  experience({ owner: 'owner123' }).register(['wrapper'], async (slots, React) => {
    expect(mounted.find('.wrapped').length).toEqual(1)
    expect(mounted.find('.replaced').length).toEqual(0)

    slots.render('wrapper', () => { return <div className='replaced' /> })
    await defer()
    expect(mounted.find('.wrapped').length).toEqual(0)
    expect(mounted.find('.replaced').length).toEqual(1)

    slots.render('wrapper', () => { return <div className='anotherThing' /> })
    await defer()
    expect(mounted.find('.wrapped').length).toEqual(0)
    expect(mounted.find('.replaced').length).toEqual(0)
    expect(mounted.find('.anotherThing').length).toEqual(1)

    slots.release()
    expect(mounted.find('.wrapped').length).toEqual(1)
    expect(mounted.find('.replaced').length).toEqual(0)
    expect(mounted.find('.anotherThing').length).toEqual(0)
  })
})

function defer () {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}
